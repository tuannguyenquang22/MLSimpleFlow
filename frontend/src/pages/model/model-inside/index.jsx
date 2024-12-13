import { DeploymentUnitOutlined, TableOutlined } from "@ant-design/icons";
import { Typography, Space, Tag, Menu, Button, Flex } from "antd";
import { Outlet, useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const { Text } = Typography;

const ModelInsidePage = () => {
    const { user: owner, name } = useParams();
    const navigate = useNavigate();

    const handleMenuClicked = (value) => {
        navigate(`/model/${owner}/${name}/${value.key}`);
    };

    const location = useLocation();
    const menuKey = location.pathname.split("/").pop();

    return (
        <div>
            <Flex
                justify="space-between"
            >
                <Space style={{ width: "100%", marginBottom: 10 }}>
                    <Text
                        style={{ fontFamily: "Jetbrains Mono", fontWeight: 400, fontSize: 18, color: "#00000073" }}
                    >
                        {owner}
                    </Text>
                    <Text
                        style={{ fontFamily: "Jetbrains Mono", fontWeight: 400, fontSize: 18, color: "#00000073" }}
                    >
                        /
                    </Text>
                    <Text
                        style={{ fontFamily: "Jetbrains Mono", fontWeight: 500, fontSize: 18 }}
                    >
                        {name}
                    </Text>
                </Space>
                <Space>
                    <Button 
                        type="primary"
                    >
                        Download
                    </Button>
                </Space>
            </Flex>
            <Space style={{ width: "100%", marginBottom: 20 }} size="small">
                <Tag color="blue" style={{ borderRadius: 10 }} icon={<TableOutlined />} >Tabular Regression</Tag>
                <Tag color="" style={{ borderRadius: 10 }} icon={<DeploymentUnitOutlined />} >Random Forest</Tag>
            </Space>
            <Menu
                mode="horizontal"
                items={[
                    { key: "overview", label: "Overview", icon: <Icon icon="mdi:view-dashboard-outline" /> },
                    { key: "experiment", label: "Experiment", icon: <Icon icon="mdi:education-outline" /> },
                    { key: "features-importance", label: "Features Importance", icon: <Icon icon="mdi:feature-search-outline" /> }
                ]}
                onClick={handleMenuClicked}
                defaultSelectedKeys={[menuKey]}
            />
            <div style={{ margin: 20 }}>
                <Outlet />
            </div>
        </div>
    )
};

export default ModelInsidePage;