import FeaturesImportanceChart from "@/components/charts/FeaturesImportanceChart";
import PredictActualChart from "@/components/charts/PredictActualChart";
import { useGetLearnerQuery, useGetTasksQuery, usePostTrainingMutation } from "@/store/api/learner/learnerApiSlice";
import { Icon } from "@iconify/react";
import { Badge, Button, Descriptions, Drawer, Flex, Space, Table, Tag, message } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";

const ModelDetail = () => {
    const { id } = useParams();
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [openCompare, setOpenCompare] = useState(false);
    const [compareColumn, setCompareColumn] = useState([]);
    const [compareDataSource, setCompareDataSource] = useState([]);

    const { data: modelResponse, isLoading, isSuccess, isError } = useGetLearnerQuery(id);
    const { data: taskResponse, isSuccess: isTaskSuccess, refetch: refetchTask } = useGetTasksQuery(id);
    const [postTraining, { isSuccess: isTrainingStartedSuccess }] = usePostTrainingMutation();


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !isSuccess || !isTaskSuccess || !modelResponse.data) {
        return <div>Error</div>;
    }


    const model = modelResponse.data;
    if (modelResponse.status === 200) {
        return <div>Error</div>;
    }

    const tasks = taskResponse.data?.map((task, index) => ({
        key: index,
        status: task.status,
        result: JSON.parse(task.result.replace(/\bNaN\b/g, '"NaN"'), (key, value) => {
            if (value === "NaN") {
                return NaN;
            }
            return value;
        }),
        date_done: task.date_done,
        id: task._id
    })) || [];

    const columns = [
        {
            title: "Deploy",
            width: 100,
            render: (_, record) => (
                <>
                    {record.status === "SUCCESS" && (
                        <Button type="default" icon={<Icon icon="tabler:rocket" />} >Deploy</Button>
                    )}
                </>
            ),
        },
        {
            title: "Tag",
            dataIndex: "id",
            key: "id",
            width: 150,
            render: (id) => (
                <Tag>
                    {id.slice(-8)}
                </Tag>
            )
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 150,
            render: (text) => {
                if (text === "SUCCESS") {
                    return (<Tag color="green">Success</Tag>);
                } else if (text === "FAILURE") {
                    return (<Tag color="red">Failure</Tag>);
                } else if (text === "PENDING") {
                    return (<Tag color="blue">Pending</Tag>);
                } else if (text === "PROGRESS") {
                    return (<Tag color="blue">Progress</Tag>);
                }
            }
        },
        {
            title: "Date Done",
            dataIndex: "date_done",
            key: "date_done",
            sorter: (a, b) => new Date(a.date_done) - new Date(b.date_done),
            render: (text) => (
                <span>{new Date(text).toLocaleString()}</span>
            )
        },
    ];

    if (model.problem_type === "regression") {
        columns.push(
            {
                key: "r2",
                title: "R2",
                dataIndex: ["result", "score", "r2"],
                render: (text) => {
                    if (text) {
                        return parseFloat(text).toFixed(4);
                    }
                }
            },
            {
                key: "rmse",
                title: "RMSE",
                dataIndex: ["result", "score", "rmse"],
                render: (text) => {
                    if (text) {
                        return parseFloat(text).toFixed(4);
                    }
                }
            },
            {
                key: "mae",
                title: "MAE",
                dataIndex: ["result", "score", "mae"],
                render: (text) => {
                    if (text) {
                        return parseFloat(text).toFixed(4);
                    }
                }
            }
        )
    }

    const handleTrainingClick = async () => {
        try {
            await postTraining(id).unwrap();
            messageApi.success("Training started");
            setTimeout(() => {
                // Refresh the task list
                refetchTask();
            }, 2000);
        } catch (error) {
            messageApi.error("Failed to start training");
            console.error(error);
        }
    };

    const onSelectChange = (newSelectedRowKeys) => {
        if (newSelectedRowKeys.length === 4) {
            messageApi.error("You can only select 3 tasks to compare");
            return;
        }
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const onCompareClick = () => {
        if (selectedRowKeys.length > 3) {
            messageApi.error("You cannot select upto 3 tasks to compare");
            return;
        }
        const selectedTasks = tasks.filter((task) => selectedRowKeys.includes(task.id));
        const compareCols = [
            {
                title: "Title",
                dataIndex: "metric",
                key: "metric",
                render: (text) => (<b>{text}</b>)
            },
            ...selectedTasks.map((task) => ({
                dataIndex: task.id.slice(-8),
                title: task.id.slice(-8),
                key: task.id.slice(-8),
            }))
        ];
        const metrics = ["r2", "rmse", "mae"];
        const hyperparameterKeys = selectedTasks[0].result.hyperparameters ? Object.keys(selectedTasks[0].result.hyperparameters) : [];
        const hyperparameterRows = hyperparameterKeys.map((key) => {
            const values = new Set(selectedTasks.map((task) => task.result.hyperparameters[key]));
            if (values.size === 1) {
                return null; // Return null for keys with identical values
            }
            const row = { metric: key, key: key };
            selectedTasks.forEach((task) => {
                let value = task.result.hyperparameters[key];
                if (typeof value === "boolean") {
                    value = value.toString();
                }
                if (typeof value === "number") {
                    value = parseFloat(value).toFixed(4);
                }
                if (value == null) {
                    value = "N/A";
                }
                row[task.id.slice(-8)] = value;
            });
            return row;
        }).filter((row) => row !== null);
        const compareData = [
            ...metrics.map((metric) => {
                const row = { metric: metric, key: metric };
                selectedTasks.forEach((task) => {
                    row[task.id.slice(-8)] = parseFloat(task.result.score[metric]).toFixed(4);
                });
                return row;
            }),
            ...hyperparameterRows
        ];
        setCompareDataSource(compareData);
        setCompareColumn(compareCols);
        setOpenCompare(true);
    };

    const hasSelected = selectedRowKeys.length > 0;
    return (
        <div>
            {contextHolder}
            <Drawer
                title="Compare"
                open={openCompare}
                closable={true}
                width={1000}
                onClose={() => setOpenCompare(false)}
            >
                <Table columns={compareColumn} dataSource={compareDataSource} />
            </Drawer>
            <Flex style={{ marginBottom: 20 }} justify="space-between">
                <Space >
                    <h3>{model.name}</h3>
                </Space>
                <Space>
                    <Button type="default" icon={<Icon icon="line-md:edit" />}>Edit</Button>
                    <Button type="default" icon={<Icon icon="mdi:image-auto-adjust" />}>Automate</Button>
                    <Button type="primary" icon={<Icon icon="codicon:run-all" />} onClick={handleTrainingClick}>Train</Button>
                </Space>
            </Flex>

            <Descriptions style={{ marginBottom: 20 }} bordered>
                <Descriptions.Item label="Problem" key="problem_type" span={3}>{model.problem_type}</Descriptions.Item>
                <Descriptions.Item label="Algorithm" key="algorithm" span={3}>{model.algorithm.name}</Descriptions.Item>
                <Descriptions.Item label="Score" key="best_score" span={3}>
                    {model.best_performance && (
                        <Badge count={parseFloat(model.best_performance).toFixed(4)} color="#52c41a" />
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Features" key="featureset" span={3} >
                    <span>{model.featureset[0].name} ({model.featureset[0]._id})</span>
                    <Space style={{ marginTop: 10 }}>
                        {model.featureset[0].features.map((feature) => (
                            <Tag key={feature.column}>{feature.column}</Tag>
                        ))}
                    </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Target" key="target" >
                    <Tag>{model.featureset[0].target.column}</Tag>
                </Descriptions.Item>
            </Descriptions>

            <h4>Predict - Actual</h4>
            <Flex
                justify="center"
            >
                <div
                    style={{
                        width: 1000,
                    }}
                >
                    {model.predict_actual && model.predict_actual.length > 0 && (
                        <PredictActualChart data={model.predict_actual} target="price" />
                    )}
                    {!model.predict_actual && (
                        <div>No data</div>
                    )}
                </div>
            </Flex>

            <h4>Feature Importances</h4>
            <Flex
                justify="center"
            >
                <div
                    style={{
                        width: 1000,
                        minHeight: 500
                    }}
                >
                    {model.features_importance && model.features_importance.length > 0 && (
                        <FeaturesImportanceChart data={model.features_importance} features={model.features_importance.map((feature, index) => (`Feature ${parseInt(index)}`))} />
                    )}
                    {!model.features_importance && (
                        <div>No data</div>
                    )}
                </div>
            </Flex>


            <Flex
                align="center"
                justify="space-between"
            >
                <h4>Execution history</h4>
                <Button
                    type="primary"
                    disabled={!hasSelected}
                    onClick={onCompareClick}
                >
                    Compare ({selectedRowKeys.length})
                </Button>
            </Flex>

            <Table
                dataSource={tasks}
                columns={columns}
                rowKey="id"
                pagination={10}
                rowSelection={{
                    selectedRowKeys,
                    onChange: onSelectChange
                }}
            />
        </div>
    )
};

export default ModelDetail;