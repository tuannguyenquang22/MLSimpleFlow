import { Table, Space, Flex, Input, Button } from "antd";
import { useState } from "react";
import AddExperimentManual from "./add-experiment";


const columns = [
    { 
        title: "ID",
        dataIndex: "id",
        key: "id",
    },
    {
        title: "Mode",
        dataIndex: "mode",
        key: "mode",
        render: (text) => <a>{text}</a>
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
    },
    {
        title: "Created",
        dataIndex: "created",
        key: "created",
    },
    {
        title: "Duration",
        dataIndex: "duration",
        key: "duration",
    },
    {
        title: "Score",
        dataIndex: "score",
        key: "score",
    },
    {
        title: "Actions",
        key: "actions",
        render: (text, record) => (
            <Space size="middle">
                <a>View</a>
                <a>Edit</a>
                <a>Delete</a>
            </Space>
        )
    }
]


const ModelInsideExperimentPage = () => {
    const [openNew, setOpenNew] = useState(false);
    const [openSchedule, setOpenSchedule] = useState(false);

    const handleOpenNewClicked = () => {
        setOpenNew(true);
    };

    return (
        <div>
            <AddExperimentManual open={openNew} onClose={() => setOpenNew(false)} />
            <Flex style={{ marginBottom: 20 }} justify="space-between">
                <Space>                
                    <Input.Search />
                </Space>
                <Space>
                    <Button type="default">Add schedule</Button>
                    <Button type="default" onClick={handleOpenNewClicked}>New</Button>
                </Space>
            </Flex>
            <Table 
                columns={columns}
                dataSource={[]}
                rowSelection={{
                    type: "checkbox"
                }}
            />
        </div>
    )
};

export default ModelInsideExperimentPage;