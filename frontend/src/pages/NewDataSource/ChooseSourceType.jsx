import { Icon } from "@iconify/react";
import { Card, Col, Radio, Row, Space } from "antd";
import { useState } from "react";

const dataSources = [
    {
        key: "MySQL",
        name: "MySQL",
        icon: "devicon:mysql",
        description: "Connect to a MySQL database"
    },
];

const ChooseSourceType = ({ dataSource, setDataSource }) => {
    
    const chosenStyles = {
        border: "2px solid #1890ff",
        textAlign: "center",
    };

    const defaultStyles = {
        textAlign: "center",
    }

    const handleDataSourceChange = (value) => {
        setDataSource(value);
    };

    const spanColValue = 24 / dataSources.length;

    return (
        <div>
            <p>We provide several data sources for you to choose from :</p>
            <Row gutter={16}>
                {dataSources.map(({ key, name, icon }) => (
                    <Col span={spanColValue} key={key}>
                        <Card
                            key={key}
                            hoverable
                            style={dataSource === key ? chosenStyles : defaultStyles}
                            onClick={() => handleDataSourceChange(key)}
                        >
                            <Icon icon={icon} style={{ fontSize: 48 }} />
                            <h5>{name}</h5>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    )
};

export default ChooseSourceType;