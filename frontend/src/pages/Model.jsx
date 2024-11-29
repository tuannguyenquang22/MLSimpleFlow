import { Badge, Button, Flex, Input, Space, Table, Tag, Alert } from "antd";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/Loading";
import { useGetLearnersQuery } from "@/store/api/learner/learnerApiSlice";

function formatString(str) {
    return str
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

const Model = () => {
    const navigate = useNavigate();

    const handleNewModel = () => {
        navigate("/model/new");
    };

    const { data, isLoading, isSuccess } = useGetLearnersQuery();

    if (isLoading) {
        return (
            <Loading />
        )
    };

    if (!isSuccess) {
        return (
            <div>
                <Alert message="Error" description="Connection Failed" type="error" showIcon />
            </div>
        )
    };

    const dataSource = data.data?.map((item) => ({
        ...item,
        key: item._id
    })) || [];

    const columns = [
        {
            dataIndex: "_id",
            key: "id",
            title: "Key",
            width: 200,
            render: (id) => (
                <Tag>
                    {id.slice(-8)}
                </Tag>
            )
        },
        {
            dataIndex: "name",
            key: "name",
            title: "Name",
        },
        {
            dataIndex: ["featureset", "name"],
            key: "featureset",
            title: "Featureset",
            render: (text, record) => (`${formatString(text)} (${record.featureset._id.slice(-8)})`)
        },
        {
            dataIndex: ["algorithm", "name"],
            key: "algorithm",
            title: "Algorithm",
            width: 150,
            render: (text) => (
                <span>{formatString(text)}</span>
            )
        },
        {
            dataIndex: "problem_type",
            key: "problem_type",
            title: "Problem Type",
            width: 150,
            render: (text) => (text.charAt(0).toUpperCase() + text.slice(1))
        },
        {
            dataIndex: "best_performance",
            title: "Best Score",
            width: 150,
            render: (text) => (
                <>
                    <Badge count={parseFloat(text).toFixed(4)} color="#52c41a" showZero/>
                </>
            )
        },
        {
            title: "Action",
            render: (_, record) => (
                <Space>
                    <Button type="primary" icon={<Icon icon="bx:bx-edit-alt" />} onClick={() => navigate(`/model/${record._id}`)} />
                    <Button type="default" icon={<Icon icon="bx:bx-trash" />} />
                </Space>
            )
        }
    ];

    return (
        <div style={{ height: "100%"}}>
            <Flex
                justify="space-between"
                style={{ marginBottom: "1rem" }}
            >
                <Space>
                    <Input placeholder="Search by model name"/>
                </Space>
                <Button type="primary" icon={<Icon icon="material-symbols:add" />} onClick={handleNewModel} >New model</Button>
            </Flex>
            <Table columns={columns} dataSource={dataSource} />
        </div>
    )
};

export default Model;