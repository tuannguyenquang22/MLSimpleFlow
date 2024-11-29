import { Form, Input, Select } from "antd";
import { useState } from "react";

const DefineFeatureSet = ({ featureSet, setFeatureSet }) => {
    const [availableOptions, setAvailableOptions] = useState(featureSet.features);

    const handleChangeName = (e) => {
        setFeatureSet({ ...featureSet, name: e.target.value });
    }

    const handleChangeDescription = (e) => {
        setFeatureSet({ ...featureSet, description: e.target.value });
    }

    const handleChangeTarget = (value) => {
        const newFeatures = availableOptions.filter((item) => item.column !== value);
        const target = availableOptions.find((item) => item.column === value);
        setFeatureSet({ ...featureSet, target: target, features: newFeatures });
    };

    const options = availableOptions.map((item) => ({
        label: item.column,
        value: item.column,
    }));

    return (
        <div>
            <Form
                layout="vertical"
            >
                <Form.Item
                    label="Name"
                >
                    <Input
                        placeholder="Enter a name for the feature set"
                        value={featureSet.name}
                        onChange={handleChangeName}
                    />
                </Form.Item>
                <Form.Item
                    label="Description"
                >
                    <Input placeholder="Enter a description for the feature set" onChange={handleChangeDescription} />
                </Form.Item>
                <Form.Item label="Target">
                    <Select options={options} onChange={handleChangeTarget} value={featureSet.target?.column} placeholder="Select target column"/>
                </Form.Item>
            </Form>
        </div>
    )
};

export default DefineFeatureSet;