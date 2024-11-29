/** Library */
import { Button, Flex, Form, Input, InputNumber, message, Select, Space, Switch } from "antd";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

/** Components */
import HyperparameterSetting from "./HyperparameterSetting";
import TuningSearchSpace from "./TuningSearchSpace";

/** API Slice */
import { useGetModelsQuery } from "@/store/api/mllib/mllibApiSlice";
import { useGetFeatureSetsQuery } from "@/store/api/featureset/featureSetApiSlice";
import { usePostLearnerMutation } from "@/store/api/learner/learnerApiSlice";
import { useNavigate } from "react-router-dom";

const SubmitButton = ({ form, children, onClick }) => {
    const [submitable, setSubmitable] = useState(false);

    const values = Form.useWatch([], form);
    useEffect(() => {
        form.validateFields({
            validateOnly: true,
        }).then(() => setSubmitable(true)).catch(() => setSubmitable(false));
    }, [form, values]);
    return (
        <Button type="primary" disabled={!submitable} onClick={onClick}>
            {children}
        </Button>
    )
};

const NewModel = () => {
    const [problemType, setProblemType] = useState(null);
    const [modelOptions, setModelOptions] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null);
    const [isTuning, setIsTuning] = useState(false);
    const [evaluationMethod, setEvaluationMethod] = useState(null);
    const navigate = useNavigate();

    const [openHyperparameterModal, setOpenHyperparameterModal] = useState(false);
    const [openTuningModal, setOpenTuningModal] = useState(false);
    const [form] = Form.useForm();

    const { data: models, isSuccess, isError, isLoading } = useGetModelsQuery();
    const { data: featuresets, isSuccess: fsIsSuccess, isError: fsIsError, isLoading: fsIsLoading } = useGetFeatureSetsQuery();
    const [ postLearner, { isSuccess: isPostLearnerSuccess, isError: isPostLearnerError } ] = usePostLearnerMutation();

    const [messageApi, contextHolder ] = message.useMessage();

    const regressionModelOptions = models?.data.regression.map((model) => ({
        label: model.charAt(0).toUpperCase() + model.slice(1).replace('_', ' '),
        value: model,
    })) || [];

    const classificationModelOptions = models?.data.classification.map((model) => ({
        label: model.charAt(0).toUpperCase() + model.slice(1).replace('_', ' '),
        value: model,
    })) || [];

    const featureSetOptions = featuresets?.data.map((fs) => ({
        label: `${fs.name} (${fs._id.slice(-8)})`,
        value: fs._id,
    })) || [];
 
    const onProblemTypeChange = (value) => {
        setProblemType(value);
        if (value === "classification") {
            setModelOptions(classificationModelOptions);
        } else if (value === "regression") {
            setModelOptions(regressionModelOptions);
        }
    };

    const onModelChange = (value) => {
        setSelectedModel(value);
    };

    const onEvaluationMethodChange = (value) => {
        setEvaluationMethod(value);
    };

    const showHyperparameterModal = () => {
        setOpenHyperparameterModal(true);
    };

    const onTuningChange = (checked) => {
        setIsTuning(checked);
    };

    const handleSubmit = async () => {
        const formData = form.getFieldsValue();
        const requestData = {   
            name: formData.name,
            description: formData.description,
            featureset_id: formData.featureset_id,
            problem_type: formData.problem_type,
            train_size: formData.train_size,
            algorithm: {
                name: formData.algorithm_name,
                params: null,
            },
        };
        try {
            const response = await postLearner(requestData);
            if (response.data != null) {
                messageApi.open({
                    type: "success",
                    content: response.message
                })
                setTimeout(() => {
                    navigate("/model");
                }, 3000);
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div>
            {contextHolder}
            {selectedModel && (
                <HyperparameterSetting
                    title={`${selectedModel} hyperparameters`}
                    open={openHyperparameterModal}
                    onCancel={() => setOpenHyperparameterModal(false)}
                    problem={problemType}
                    model={selectedModel}
                />
            )}
            <Form 
                layout="vertical"
                form={form}
                autoComplete="off"
            >
                <h4>General</h4>
                <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Description" name="description">
                    <Input />
                </Form.Item>
                <Form.Item label="Problem type" name="problem_type" rules={[{ required: true }]}>
                    <Select
                        options={[
                            {
                                label: "Classification",
                                value: "classification"
                            },
                            {
                                label: "Regression",
                                value: "regression"
                            }
                        ]}
                        onChange={onProblemTypeChange}
                    />
                </Form.Item>
                <h4>Feature Set</h4>
                <Form.Item 
                    label="Choose a feature set" 
                    name="featureset_id"
                    rules={[
                        { required: true, message: "Please select a feature set" }
                    ]}
                >
                    <Select options={featureSetOptions} />
                </Form.Item>
                <h4>Model</h4>
                <Form.Item 
                    label="Algorithm, choose 'stacking' if you want to use Stacking Ensemble." 
                    name="algorithm_name" 
                    rules={[{ required: true }]}
                >
                    <Select options={modelOptions} onChange={onModelChange} />
                </Form.Item>
                {selectedModel === "stacking" && (
                    <>
                        <Form.Item label="Base Learners">
                            <Select mode="multiple" options={modelOptions.filter((item) => item.value !== "stacking")} />
                        </Form.Item>
                        <Form.Item label="Meta Learner">
                            <Select options={modelOptions.filter((item) => item.value !== "stacking")} />
                        </Form.Item>
                    </>
                )}
                {selectedModel && selectedModel !== "stacking" && (
                    <>
                        <Form.Item label="Hyperparameters">
                            <Button
                                type="default"
                                block
                                icon={<Icon icon="solar:tuning-bold" />}
                                onClick={() => showHyperparameterModal()}
                            >
                                Open settings
                            </Button>
                        </Form.Item>
                        <Space>
                            <span>Enable hyperparameters optimization</span>
                            <Switch onChange={onTuningChange} />
                        </Space>
                    </>
                )}

                {isTuning && (
                    <>
                        <TuningSearchSpace open={openTuningModal} hyperparameters={[]} onCancel={() => setOpenTuningModal(false)} />
                        <h4>Tuning</h4>
                        <Form.Item label="Search space">
                            <Button
                                type="dashed"
                                block
                                icon={<Icon icon="ix:optimize" />}
                                onClick={() => setOpenTuningModal(true)}
                            >
                                Search Space Setting
                            </Button>
                        </Form.Item>
                        <Form.Item label="Objective metric">
                            <Select options={[]} />
                        </Form.Item>
                        <Form.Item label="Max iterations" name="max_trials" initialValue={10}>
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                    </>
                )}

                <h4>Evaluation</h4>
                <Form.Item 
                    label="Method" 
                    name="evaluate_method" 
                    initialValue={"holdout"}
                    rules={[{ required: true }]}
                >
                    <Select 
                        options={[
                            { label: "Cross Validation", value: "cross_validation" },
                            { label: "Holdout", value: "holdout" }
                        ]}
                        onChange={onEvaluationMethodChange}
                    />
                </Form.Item>
                <Form.Item 
                    label="Training size (%)" 
                    name="train_size" 
                    initialValue={80}
                    rules={[{ required: true }]}
                >
                    <InputNumber style={{ width: "100%" }} min={70} max={80} />
                </Form.Item>
                {evaluationMethod === "cross_validation" && (
                    <Form.Item label="Folds" name="folds" initialValue={5}>
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                )}

                <Form.Item>
                    <Flex
                        style={{ marginTop: 20 }}
                        justify="center"
                        gap={10}
                    >
                        <Button type="default">Cancel</Button>
                        <SubmitButton form={form} onClick={handleSubmit}>Create Model</SubmitButton>
                    </Flex>
                </Form.Item>
            </Form>
        </div>
    )
};

export default NewModel;