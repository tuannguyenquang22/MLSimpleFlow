import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, Space, theme, message } from "antd";
import { Suspense, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";

const { Sider, Content, Header } = Layout;

const menus = [
    {
        key: "feature-set",
        label: <Link to="feature-set">Feature Set</Link>,
        title: "Feature Set",
        icon: <Icon icon="tdesign:collection" />
    },
    {
        key: "data-source",
        label: <Link to="data-source">Data Source</Link>,
        title: "Data Source",
        icon: <Icon icon="ep:connection" />
    },
    {
        key: "model",
        label: <Link to="model">Model</Link>,
        title: "Model",
        icon: <Icon icon="carbon:analytics" />
    },
    {
        key: "deploy",
        label: "Deploy",
        title: "Deploy",
        icon: <Icon icon="tabler:rocket" />
    }
];

const Theme = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const location = useLocation();
    const activeMenu = location.pathname.split("/");

    return (
        <Layout>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    insetInlineStart: 0,
                    top: 0,
                    bottom: 0,
                    scrollbarWidth: 'thin',
                    scrollbarGutter: 'stable',
                }}
            >
                <div
                    style={{
                        color: "white",
                        alignItems: "center",
                    }}
                >
                    <h3 style={{ textAlign: "center" }}>MLSimpleFlow</h3>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={[activeMenu[1]]}
                    items={menus}
                />
            </Sider>
            <Layout
                style={{
                    marginInlineStart: 200,
                }}
            >
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >
                    <h4
                        style={{
                            margin: 0,
                            padding: "0 24px",
                        }}
                    >
                        {menus.find((item) => item.key === activeMenu[1])?.title.toUpperCase()}
                    </h4>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        overflow: 'initial',
                    }}
                >
                    <div
                        style={{
                            padding: 24,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            minHeight: "90vh",
                        }}
                    >
                        {contextHolder}
                        <Suspense fallback={<div>Loading...</div>} >
                            {<Outlet />}
                        </Suspense>
                    </div>
                </Content>
            </Layout>
        </Layout>
    )
};

export default Theme;