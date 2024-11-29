import { Flex, Spin } from "antd";

const contentStyle = {
    padding: 50,
    borderRadius: 4,
};

const content = <div style={contentStyle} />;

const Loading = () => {
    return (
        <Flex
            style={{
                height: "80vh",
            }}
            justify="center"
            align="center"
            dir="vertical"
        >
            <Spin size="large" tip="Loading">
                {content}
            </Spin>

        </Flex>
    )
};

export default Loading;