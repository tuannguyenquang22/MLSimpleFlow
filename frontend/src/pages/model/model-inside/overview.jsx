import ReactMarkdown from "react-markdown";
import { Card, Col, Flex, Input, Row, Space, Statistic, Timeline, Typography } from "antd";
import { useState } from "react";
import { Icon } from "@iconify/react";
import PerformanceChart from "../../../charts/PerformanceChart";


const { Text } = Typography;

const ModelInsideOverviewPage = () => {
    const [readme, setReadme] = useState("# Overview \n\n Write your model overview here");

    return (
        <div>
            <Row gutter={16}>
                <Col span={14}>
                    <Card size="small">
                        <ReactMarkdown>{readme}</ReactMarkdown>
                    </Card>
                </Col>
                <Col span={10}>
                    <Space
                        direction="vertical"
                        style={{ width: "100%" }}
                    >
                        <Card size="small">
                            <Flex justify="space-between" style={{ height: 100}}>
                                <Space>
                                    <Statistic  title="Best r2 score" value={0.9863} precision={2} />
                                </Space>
                                <div style={{ width: "65%" }}>
                                    <PerformanceChart />
                                </div>
                            </Flex>
                        </Card>
                        <Card size="small">
                            <Space style={{ marginBottom: 15}}>
                                <Icon icon="solar:database-bold-duotone" style={{ paddingTop: 5 }} fontSize={20} />
                                <Text style={{ fontWeight: 600 }}>Dataset</Text>
                            </Space>
                            <Card size="small">
                                <Text style={{ fontFamily: "Jetbrains Mono", fontWeight: 500 }}>test-user-1/data-1</Text>
                            </Card>
                        </Card>
                        <Card size="small">
                            <Space style={{ marginBottom: 25}}>
                                <Icon icon="ic:twotone-auto-fix-high" style={{ paddingTop: 5 }} fontSize={20} />
                                <Text style={{ fontWeight: 600 }}>Data preprocessing</Text>
                            </Space>
                            <Timeline 
                                mode="left"
                                items={[
                                    { 
                                        children: "Impute numeric missing values with mean"
                                    },
                                    {
                                        children: "Impute categorical missing values with mode"
                                    },
                                    {
                                        children: "One-hot encode categorical features"
                                    },
                                    {
                                        children: "Standardize numeric features"
                                    },
                                ]}
                            />
                        </Card>
                    </Space>
                </Col>
            </Row>

        </div>
    )
};

export default ModelInsideOverviewPage