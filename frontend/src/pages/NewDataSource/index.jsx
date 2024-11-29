import { Button, Flex, Form, Steps, message } from "antd";
import { useState } from "react";
import ChooseSourceType from "./ChooseSourceType";
import FormMySQL from "./FormMySQL";
import FormMinIO from "./FormMinIO";
import { usePostDataSourceMutation } from "@/store/api/datasource/dataSourceApiSlice";
import { useNavigate } from "react-router-dom";


const NewDataSource = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [requestForm] = Form.useForm();
    const navigate = useNavigate();

    const [ postDataSource, { isLoading, isError, error, isSuccess } ] = usePostDataSourceMutation();

    const [sourceType, setSourceType] = useState(null);
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent(current + 1);
    const prev = () => setCurrent(current - 1);

    const steps = [
        {
            title: "Choose your data source type",
            content: <ChooseSourceType dataSource={sourceType} setDataSource={setSourceType}/>
        },
        {
            title: "Configure connection",
            content: <>
                {sourceType === "MySQL" && <FormMySQL form={requestForm}/>}
                {sourceType === "CSV" && <FormMinIO />}
            </>
        },
    ];

    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));

    const handleFinish = async () => {
        try{
            const values = await requestForm.validateFields();
            const { name, description, ...connection_detail } = values;
            const data = {
                name: name,
                description: description,
                origin: sourceType?.toLowerCase(),
                connection_detail: connection_detail,
            }

            const response = await postDataSource(data).unwrap();
            if (response.status === 200) {
                messageApi.open({
                    type: "error",
                    content: response.message
                })
            } 

            if (response.status === 100) {
                messageApi.open({
                    type: "success",
                    content: response.message
                })
                // Wait 3s before redirecting to /data-source
                setTimeout(() => {
                    navigate("/data-source");
                }, 3000);
            }
        } catch (error) {
            messageApi.error("Please fill in all required fields");
            return;
        }
    };

    return (
        <div>
            {contextHolder}
            <Steps 
                items={items} 
                current={current}
                type="navigation"
                size="small"
            />
            <div
                style={{
                    marginTop: 16,
                }}
            >
                {steps[current].content}
            </div>
            <div
                style={{ marginTop: 16 }}
            >
                <Flex
                    style={{ width: "100%" }}
                    justify="center"
                    gap="small"
                >
                    {current > 0 && (
                        <Button type="default" onClick={prev}>Previous</Button>
                    )}

                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={next}>Next</Button>
                    )}

                    {current === steps.length - 1 && (
                        <Button type="primary" onClick={handleFinish}>Connect</Button>
                    )}
                </Flex>
            </div>
        </div>
    );
};

export default NewDataSource;