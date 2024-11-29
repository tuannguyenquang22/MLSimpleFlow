import { Button, Flex, Form, Input, InputNumber, Modal, Select, Space } from "antd";
import { Icon } from "@iconify/react";


const TuningSearchSpace = ({ open, hyperparameters, onCancel }) => {
    return (
        <Modal
            open={open}
            onCancel={onCancel}
            width={850}
            title="Tuning Search Space"
        >
            <Form
                name="tuning"
                layout="vertical"
            >
                <Form.List name="search_space">
                    {(fields, { add, remove }, { errors }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Flex
                                    key={key}
                                    style={{ width: "100%" }}
                                    gap={20}
                                >
                                    <Form.Item
                                        style={{ minWidth: 200 }}
                                        name={[name, "hyperparameter"]}
                                        label="Hyperparameter"
                                    >
                                        <Select
                                            placeholder="Select hyperparameter"
                                            options={[
                                                { label: "n_estimators", value: "n_estomators" },
                                                { label: "max_depth", value: "max_depth" },
                                            ]}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        style={{ minWidth: 150 }}
                                        name={[name, "type"]}
                                        label="Type"
                                    >
                                        <Select
                                            placeholder="Select type"
                                            options={[
                                                { label: "Float Range", value: "float_range" },
                                                { label: "Interger Range", value: "int_range" },
                                                { label: "Logarit Range", value: "log_range" },
                                                { label: "Bool", value: "bool" },
                                                { label: "Choice", value: "choice" },
                                                { label: "Constant", value: "constant" },
                                            ]}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        shouldUpdate={(prevValues, currentValues) => {
                                            const prevType = prevValues.search_space?.[name]?.type;
                                            const currentType = currentValues.search_space?.[name]?.type;
                                            return prevType !== currentType;
                                        }}
                                        noStyle
                                    >
                                        {({ getFieldValue }) => {
                                            const currentType = getFieldValue(["search_space", name, "type"]);
                                            switch (currentType) {
                                                case "float_range":
                                                case "int_range":
                                                case "log_range":
                                                    return (
                                                        <Space
                                                            style={{ width: 300 }}
                                                        >
                                                            <Form.Item
                                                                name={[name, "min"]}
                                                                label="Min Value"
                                                            >
                                                                <InputNumber placeholder="Min" style={{ width: "100% " }} />
                                                            </Form.Item>
                                                            <Form.Item
                                                                name={[name, "max"]}
                                                                label="Max Value"
                                                            >
                                                                <InputNumber placeholder="Max" style={{ width: "100% " }} />
                                                            </Form.Item>
                                                        </Space>
                                                    );
                                                case "bool":
                                                    return null;
                                                case "choice":
                                                case "constant":
                                                    return (
                                                        <Space>
                                                            <Form.Item
                                                                name={[name, "values"]}
                                                                label="Value"

                                                            >
                                                                <Input placeholder="Value" style={{ width: 300 }} />
                                                            </Form.Item>
                                                        </Space>
                                                    );
                                                default:
                                                    return null;
                                            }
                                        }}
                                    </Form.Item>
                                    <Form.Item label="Remove">
                                        <Button
                                            type="default"
                                            onClick={() => remove(name)}
                                            icon={<Icon icon="mynaui:trash" />}
                                        />
                                    </Form.Item>
                                </Flex>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<Icon icon="hugeicons:search-add" />}
                                >
                                    Add Search Space
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
        </Modal>
    )
};

export default TuningSearchSpace;