import { Alert, Button, Flex, Input, Select, Space, Table, Tag } from "antd";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useGetDataSourcesQuery } from "@/store/api/datasource/dataSourceApiSlice";
import Loading from "@/components/Loading";

const columns = [
    {
        dataIndex: "origin",
        title: "Source",
        key: "origin",
        width: 200,
        render: (source) => (
            <>
                {source === "mysql" && (
                    <Space>
                        <Icon icon="devicon:mysql" />
                        <span>MySQL</span>
                    </Space>
                )}
                {source === "mongodb" && (
                    <Space>
                        <Icon icon="devicon:mongodb" />
                        <span>MongoDB</span>
                    </Space>
                )}
                {source === "minio" && (
                    <Space>
                        <Icon icon="lsicon:file-csv-filled" />
                        <span>CSV</span>
                    </Space>
                )}
            </>
        )
    },
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
        title: "Name",
        key: "name",
    },
    {
        dataIndex: "modified",
        title: "Modified At",
        key: "modified",
        width: 300,
        render: (date) => new Date(date).toLocaleString()
    },
    {
        key: "action",
        width: 200,
        render: () => (
            <Space>
                <Button type="text" icon={<Icon icon="akar-icons:info-fill" color="#142033" />} />
                <Button type="text" icon={<Icon icon="ri:edit-fill" color="	#e29c04" />} />
                <Button type="text" icon={<Icon icon="ic:baseline-delete" color="#c24604"/>} />
            </Space>
        )   
    }
];


const DataSource = () => {
    const navigate = useNavigate();
    const { data, error, isLoading, isSuccess } = useGetDataSourcesQuery();

    const moveToNewDataSource = () => {
        navigate("/data-source/new");
    };

    if (isLoading) {
        return <Loading />;
    }

    if (isSuccess) {
        const dataSource = data.data.map((item) => ({
            ...item,
            key: item._id,
        }));

        return (
            <div>
                <Flex
                    justify="space-between"
                    style={{ marginBottom: 16 }}
                >
                    <div id="filter">
                        <Space>
                            <Select 
                                style={{ width: 150 }}
                                defaultValue="all"
                                options={[
                                    {
                                        label: "Source: All",
                                        value: "all"
                                    },
                                    {
                                        label: "Source: MySQL",
                                        value: "mysql"
                                    },
                                    {
                                        label: "Source: MongoDB",
                                        value: "mongodb"
                                    },
                                    {
                                        label: "Source: CSV",
                                        value: "csv"
                                    }
                                ]}
                            />

                            <Input 
                                style={{ width: 200 }}
                                placeholder="Enter name" 
                            />
                            <Button 
                                type="default" 
                                icon={<Icon icon="mdi:filter-outline" />}
                            />
                        </Space>
                    </div>
                    <Button
                        type="primary"
                        onClick={moveToNewDataSource}
                        icon={<Icon icon="akar-icons:plus" color="#fff"/>} 
                    >
                        New data source
                    </Button>
                </Flex>
                <Table columns={columns} dataSource={dataSource}/>
            </div>
        )
    };

    if (error) {
        return (
            <div>
                <Alert message="Error" description="Connection Failed" type="error" showIcon/>
            </div>
        )
    }
};

export default DataSource;