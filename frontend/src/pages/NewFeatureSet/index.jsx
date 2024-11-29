import { Flex, Steps, Button, message } from "antd";
import { useState } from "react";
import ChooseSource from "./ChooseSource";
import DefineFeatureSet from "./DefineFeatureSet";
import DataValidation from "./DataValidation";
import ReviewFeatureSet from "./ReviewFeatureSet";
import { usePostFeatureSetMutation, usePostProfilingMutation } from "@/store/api/featureset/featureSetApiSlice";
import { useNavigate } from "react-router-dom";


const NewFeatureSet = () => {
    const [current, setCurrent] = useState(0);

    const [result, setResult] = useState(null);
    const [profilingData, setProfilingData] = useState(null);

    const [featureSet, setFeatureSet] = useState({
        name: null,
        description: null,
        collection: null,
        datasource_id: null,
        features: null,
        target: null,
    });

    const [postFeatureSet, { isError, isLoading, isSuccess, error }] = usePostFeatureSetMutation();
    const [postProfiling, { isLoadingProfiling, errorProfiling }] = usePostProfilingMutation();

    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const next = async () => {
        if (featureSet.datasource_id == null) {
            messageApi.open({
                type: "error",
                content: "Please choose a data source",
                duration: 3
            })
            return;
        }
        if (current === 0) {
            try {
                const request = {
                    "datasource_id": featureSet.datasource_id,
                    "collection": featureSet.collection,
                }
                const response = await postProfiling(request).unwrap();
                const responseData = response.data.map((item, index) => ({
                    key: index,
                    column: item.column,
                    count: item.count,
                    data_type: item.data_type,
                    unique: item.unique,
                    missing: item.missing,
                    mean_mode: item.mean_mode,
                    suggest_transformer: item.suggest_transformer,
                })
                )
                setProfilingData(responseData);
            } catch (error) {
                console.log(error);
            }
        }
        if (current === 1) {
            if (featureSet.features == null) {
                messageApi.open({
                    type: "error",
                    content: "Please select features",
                    duration: 3
                })
                return;
            }
        }
        if (current === steps.length - 2) {
            if (featureSet.name == null || featureSet.description == null || featureSet.target == null) {
                messageApi.open({
                    type: "error",
                    content: "Please fill all the fields",
                    duration: 3
                })
            }
            try {
                const response = await postFeatureSet(featureSet).unwrap();
                if (response.status === 100) {
                    setResult("success");
                    messageApi.open({
                        type: "success",
                        content: "Feature set created successfully",
                        duration: 3
                    })
                    setTimeout(() => {
                        navigate("/feature-set");
                    }); 
                }

                if (response.status === 200) {
                    setResult("error");
                    messageApi.open({
                        type: "error",
                        content: response.message,
                        duration: 3
                    })
                }
            } catch (error) {
                console.log(error);
            }
        };
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const steps = [
        {
            title: "Choose data source",
            content: <ChooseSource featureSet={featureSet} setFeatureSet={setFeatureSet} />
        },
        {
            title: "Validate data",
            content: <DataValidation featureSet={featureSet} setFeatureSet={setFeatureSet} data={profilingData} />
        },
        {
            title: "Define feature set",
            content: <DefineFeatureSet featureSet={featureSet} setFeatureSet={setFeatureSet} />
        },
        {
            title: "Automate transformation",
            content: <ReviewFeatureSet status={result} />,
        }
    ];

    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));

    return (
        <div>
            {contextHolder}
            <Steps
                current={current}
                items={items}
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
            <div>
                <Flex
                    style={{ width: "100%" }}
                    justify="center"
                    gap="small"
                >
                    {current > 0 && (
                        <Button onClick={prev}>Previous</Button>
                    )}
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={next}>Next</Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" onClick={() => navigate("/feature-set")}>Done</Button>
                    )}
                </Flex>
            </div>
        </div>
    );
};

export default NewFeatureSet;