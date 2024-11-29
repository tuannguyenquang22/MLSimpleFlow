import Loading from "@/components/Loading";
import { useGetFeatureSetsQuery } from "@/store/api/featureset/featureSetApiSlice";
import { Alert, Button, Flex, Input, Table, Space, Tag } from "antd";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

const FeatureSet = () => {
    const navigate = useNavigate();

    const handleNewFeatureSet = () => {
        navigate("/feature-set/new");
    };

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
            dataIndex: "n_features",
            key: "n_features",
            title: "Number of Features",
        },
        {
            dataIndex: "modified",
            title: "Modified At",
            width: 300,
            render: (date) => new Date(date).toLocaleString()
        },
        {
            key: "action",
            width: 200,
            render: () => (
                <Space>
                    <Button type="text" icon={<Icon icon="akar-icons:info-fill" color="#142033" />} />
                    <Button type="text" icon={<Icon icon="ic:baseline-delete" color="#c24604"/>} />
                </Space>
            )   
        }
    ]

    const { data, isLoading, isSuccess } = useGetFeatureSetsQuery();

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
        );
    }

    const dataSource = data.data.map((item) => ({
        ...item,
        n_features: item.features.length,
        key: item._id
    }));

    return (
        <div style={{ height: "100%"}}>
            <Flex
                justify="space-between"
                style={{ marginBottom: "1rem" }}
            >
                <Input.Search style={{ width: 500 }} placeholder="Enter name of feature set" />
                <Button 
                    type="primary" 
                    onClick={handleNewFeatureSet}
                    icon={<Icon icon="akar-icons:plus" color="#fff" />}
                >
                    New feature set
                </Button>
            </Flex>
            <Table dataSource={dataSource} columns={columns}/>
        </div>
    )
};

export default FeatureSet;