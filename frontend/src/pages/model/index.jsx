import { Avatar, Badge, Button, Card, Flex, Input, List, Menu, Select, Space, Tag, Typography, theme } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { TableOutlined, DeploymentUnitOutlined } from '@ant-design/icons';

const { Text } = Typography

const dataSource = [
    { owner: "user1", name: "model1", type: "model" },
]

const ModelPage = () => {
    const navigate = useNavigate();

    const navigateToInside = (user, name) => {
        navigate(`/model/${user}/${name}/overview`)
    };

    return (
        <div>
            <Flex
                style={{ margin: "20px 0" }}
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
                <Space>
                    <Button type="default" icon={<Icon icon="akar-icons:filter" />}>Upload</Button>
                    <Button type="primary" icon={<Icon icon="hugeicons:connect" />}>New</Button>
                </Space>
            </Flex>

            <List
                dataSource={dataSource}
                grid={{ gutter: 16, column: 1 }}
                renderItem={(item, index) => (
                    <List.Item key={index}>
                        <Card 
                            style={{ width: "100%" }} 
                            hoverable 
                            size="small" 
                            onClick={() => navigateToInside(item.owner, item.name)}
                        >
                            <Flex align="center" justify="start">
                                {/* <Avatar
                                    shape="square"
                                    size={32}
                                    style={{ backgroundColor: "#ffffff", color: "#000000" }}
                                    icon={itemIcons[item.type]}
                                /> */}
                                <Space direction="vertical" style={{ marginLeft: 10 }}>
                                    <Text 
                                        style={{ fontFamily: "Jetbrains Mono", fontWeight: 500 }} 
                                    >
                                        {item.owner}/{item.name}
                                    </Text>
                                    <Space size="small">
                                        <Space>
                                            <TableOutlined style={{ color: "#00000073" }} />
                                            <Text type="secondary">Tabular Regression</Text>
                                        </Space>
                                        <Text type="secondary">•</Text>
                                        <Space>
                                            <DeploymentUnitOutlined style={{ color: "#00000073" }} />
                                            <Text type="secondary">Random Forest</Text>
                                        </Space>
                                        <Text type="secondary">•</Text>
                                        <Text type="secondary">Updated Jan 10, 2024</Text>
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

export default ModelPage