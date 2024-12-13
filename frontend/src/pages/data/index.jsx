import { Avatar, Badge, Button, Card, Flex, Input, List, Menu, Select, Space, Tag, Typography } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';


const { Text } = Typography


const items = [
    {
        key: "upload",
        label: <Link to="/data/upload">Upload</Link>,
        icon: (<Badge style={{ paddingTop: 4 }} count={100} color="#1b4965" />)
    },
    {
        key: "database",
        label: <Link to="/data/database">External Database</Link>,
        icon: (<Badge style={{ paddingTop: 4 }} count={100} color="#1b4965" />)
    },
]

const itemIcons = {
    "csv": <Icon icon="grommet-icons:document-csv" color='#f07167' fontSize={28} />,
    "xlsx": <Icon icon="vscode-icons:file-type-excel" fontSize={28} />,
    "parquet": <Icon icon="simple-icons:apacheparquet" fontSize={28} color="#48cae4" />,
    "mysql": <Icon icon="logos:mysql"  fontSize={28} />,
    "postgres": <Icon icon="devicon:postgresql-wordmark" fontSize={28} />,
}

const data = [
    { name: "file-name", updated: "Jan 10, 2024", rows: 561, columns: 32, owner: "test-user", type: "csv" },
    { name: "file-name-1", updated: "Jan 10, 2024", rows: 561, columns: 32, owner: "test-user-1", type: "csv" },
    { name: "file-name-2", updated: "Jan 10, 2024", rows: 561, columns: 32, owner: "test-user", type: "xlsx" },
    { name: "file-name-3", updated: "Jan 10, 2024", rows: 561, columns: 32, owner: "test-user-1", type: "parquet" },
];

const externalData = [
    { name: "file-name", updated: "Jan 10, 2024", rows: 561, columns: 32, owner: "test-user", type: "mysql" },
    { name: "file-name-1", updated: "Jan 10, 2024", rows: 561, columns: 32, owner: "test-user-1", type: "postgres" },
]

const DataPage = () => {
    const { section: selectedKey } = useParams()

    const dataSource = selectedKey === "upload" ? data : externalData

    return (
        <div>
            <Menu items={items} mode="horizontal" defaultSelectedKeys={[selectedKey]} />
            {/* Filter and Import/Create */}

            {selectedKey === "upload" && (
                <Flex
                    style={{ marginTop: 20 }}
                    justify="space-between"
                >
                    <Flex align='center' gap={10}>
                        <Text>Sort by </Text>
                        <Select
                            defaultValue="newest"
                            style={{ width: 120 }}
                            options={[
                                { label: "Newest", value: "newest" },
                                { label: "Oldest", value: "oldest" },
                            ]}
                        />
                        <Input.Search placeholder="Search by name" style={{ width: 300 }} />
                    </Flex>
                    <Button type="primary" icon={<Icon icon="material-symbols:upload" />}>Upload</Button>
                </Flex>
            )}

            {selectedKey === "database" && (
                <Flex
                    style={{ marginTop: 20 }}
                    justify="space-between"
                >
                    <Flex align='center' gap={10}>
                        <Text>Sort by </Text>
                        <Select
                            defaultValue="newest"
                            style={{ width: 120 }}
                            options={[
                                { label: "Newest", value: "newest" },
                                { label: "Oldest", value: "oldest" },
                            ]}
                        />
                        <Input.Search placeholder="Search by name" style={{ width: 300 }} />
                    </Flex>
                    <Button type="primary" icon={<Icon icon="hugeicons:connect" />}>Connect</Button>
                </Flex>
            )}
            <div style={{ margin: "10px 0" }}>
                <Text type="secondary">Matches {dataSource.length} file{dataSource.length > 1 ? "s" : ""} </Text>
            </div>
            <List
                dataSource={dataSource}
                grid={{ gutter: 16, column: 1 }}
                renderItem={(item, index) => (
                    <List.Item key={index}>
                        <Card style={{ width: "100%" }} hoverable size="small" >
                            <Flex align="center" justify="start">
                                <Avatar
                                    shape="square"
                                    size={32}
                                    style={{ backgroundColor: "#ffffff", color: "#000000" }}
                                    icon={itemIcons[item.type]}
                                />
                                <Space direction="vertical" style={{ marginLeft: 10 }}>
                                    <Text style={{ fontFamily: "Jetbrains Mono", fontWeight: 500 }}>
                                        {item.owner}/{item.name}
                                    </Text>
                                    <Space size="small">
                                        <Text type="secondary">Updated Jan 10, 2024</Text>
                                        <Text type="secondary">•</Text>
                                        <Text type="secondary">561 rows</Text>
                                        <Text type="secondary">•</Text>
                                        <Text type="secondary">32 columns</Text>
                                    </Space>
                                </Space>
                            </Flex>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    )
}

export default DataPage