import { Form, Modal, Input } from "antd";
import { useGetHyperparametersQuery } from "@/store/api/mllib/mllibApiSlice";
import { useEffect, useState } from "react";


const HyperparameterSetting = ({ open, onCancel, title, problem, model }) => {
    const { data, error, isLoading, isSuccess } = useGetHyperparametersQuery({ problem, model }, { skip: !problem || !model || !open });
    const [hyperparameters, setHyperparameters] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        if (isSuccess && data) {
            let parseData = JSON.parse(data);
            if (parseData.status === 100) {
                setHyperparameters(parseData.data);
            }
        }
    }
    , [isSuccess, data]);

    const handleSubmit= () => {
        let currentHyperparameters = form.getFieldsValue();
        // Adjust the hyperparameters to the correct data type
        let adjustedHyperparameters = {};
        for (let key in currentHyperparameters) {
            let value = currentHyperparameters[key];
            if (value === "null" || value === "") {
                adjustedHyperparameters[key] = null;
            } else if (Number.isInteger(parseInt(value, 10))) {
                adjustedHyperparameters[key] = parseInt(value, 10);
            } else if (value === "true" || value === "false") {
                adjustedHyperparameters[key] = value == "true";
            } else {
                adjustedHyperparameters[key] = value;
            }
        }
        setHyperparameters(adjustedHyperparameters);
    };

    return (
        <Modal 
            title={title}
            open={open}
            onCancel={onCancel}
            onOk={handleSubmit}
            width={800}
        >
            {isSuccess && hyperparameters && (
                <Form labelCol={{span: 8}} wrapperCol={{ span: 8}} form={form} style={{ marginTop: 20 }}>
                    {Object.entries(hyperparameters).map(([key, value]) => (
                        <Form.Item label={key} key={key} name={key} initialValue={value}>
                            <Input placeholder={value == null ? "null" : ""}/>
                        </Form.Item>
                    ))}
                </Form>
            )}
        </Modal>
    );
};

export default HyperparameterSetting;