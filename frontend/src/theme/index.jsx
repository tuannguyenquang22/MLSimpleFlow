import { sidebarMenuItem } from "../constants/data"
import { Breadcrumb, Layout, Menu, theme, Space, Flex, ConfigProvider, Image } from "antd"
import { Link, Outlet, useLocation } from "react-router-dom"

import MLImage from "../assets/ml.png"
import { Icon } from "@iconify/react"

const { Content, Header, Footer, } = Layout

const items = sidebarMenuItem.map((item) => ({
    key: item.key,
    label: <Link to={item.path}>{item.title}</Link>,
    icon: <Icon icon={item.icon} />
}))

const customizedThemeData = {
    font: {
        family: "Poppins",
        size: 13,
    },
    color: {
        headerBg: "#ffffff",
        headerColor: "#000000",
        primary: "#4361ee",
    }
}

const Theme = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const location = useLocation();

    const currentPath = location.pathname.split("/")[1];

    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: customizedThemeData.font.family,
                    fontSize: customizedThemeData.font.size,
                    colorPrimary: customizedThemeData.color.primary,
                    
                },
                components: {
                    Layout: {
                        headerBg: customizedThemeData.color.headerBg,
                        headerColor: customizedThemeData.color.headerColor,
                    }
                },
            }}
        >
            <Layout>
                <Header
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        width: '100%',
                        display: 'flex',
                    }}
                >
                    <Flex align="center"gap={10}>
                        <Image src={MLImage} preview={false} width={32} />
                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>simpleflow</h3>
                    </Flex>
                    <Menu
                        mode="horizontal"
                        items={items}
                        style={{
                            width: '100%',
                            marginLeft: 48,
                        }}
                        defaultSelectedKeys={[currentPath]}
                    />
                </Header>
                <Content
                    style={{
                        padding: '0 48px',
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: '16px 0',
                        }}
                    />
                    <div
                        style={{
                            padding: 24,
                            minHeight: 380,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Layout>
        </ConfigProvider>
    )
}

export default Theme