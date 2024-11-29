import { Table, Select } from "antd";
import { useEffect, useState } from "react";

const typeOptions = [
    { label: "Categorical", value: "category" },
    { label: "Numerical", value: "numeric" },
    { label: "DateTime", value: "datetime" },
    { label: "Boolean", value: "boolean" },
];

const numericTransformationOptions = [
    { label: "Standard Scaler", value: "standard_scaler" },
    { label: "Min Max Scaler", value: "min_max_scaler" },
    { label: "Passthrough", value: "passthrough" },
];

const categoryTransformationOptions = [
    { label: "One Hot Encoder", value: "one_hot_encoder" },
    { label: "Label Encoder", value: "label_encoder" },
];

const datetimeTransformationOptions = [
    { label: "Date Difference", value: "date_difference" },
    { label: "Cyclic Encoder", value: "cyclic_encoder" },
];

const getTransformerOptions = (dataType) => {
    switch (dataType) {
        case "numeric":
            return numericTransformationOptions;
        case "category":
            return categoryTransformationOptions;
        case "datetime":
            return datetimeTransformationOptions;
        case "boolean":
            return categoryTransformationOptions; // Assuming same as category
        default:
            return [];
    }
};

const getDefaultTransformer = (dataType) => {
    switch (dataType) {
        case "numeric":
            return "standard_scaler";
        case "category":
            return "one_hot_encoder";
        case "datetime":
            return "date_difference";
        case "boolean":
            return "label_encoder";
        default:
            return "passthrough";
    }
};

const DataValidation = ({ featureSet, setFeatureSet, data }) => {
    const [tableData, setTableData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    useEffect(() => {
        setTableData(data.map((item) => ({ ...item })));
    }, [data]);

    useEffect(() => {
        setSelectedRowKeys(featureSet.features?.map((feature) => feature.column) || []);
    }, [featureSet.features]);

    const handleDataTypeChange = (value, column) => {
        setTableData((prevData) =>
            prevData.map((item) =>
                item.column === column
                    ? {
                        ...item,
                        data_type: value,
                        suggest_transformer: getDefaultTransformer(value),
                    }
                    : item
            )
        );

        if (selectedRowKeys.includes(column)) {
            updateFeatureSet(column, value, getDefaultTransformer(value));
        }
    };

    const handleTransformerChange = (value, column) => {
        setTableData((prevData) =>
            prevData.map((item) =>
                item.column === column ? { ...item, suggest_transformer: value } : item
            )
        );

        if (selectedRowKeys.includes(column)) {
            updateFeatureSetTransformer(column, value);
        }
    };

    const updateFeatureSet = (columnName, dataType, transformer) => {
        setFeatureSet((prevFeatureSet) => {
            const updatedFeatures = prevFeatureSet.features.map((feature) =>
                feature.column === columnName
                    ? { ...feature, data_type: dataType, transformation: transformer }
                    : feature
            );
            return {
                ...prevFeatureSet,
                features: updatedFeatures,
            };
        });
    };

    const updateFeatureSetTransformer = (columnName, transformer) => {
        setFeatureSet((prevFeatureSet) => {
            const updatedFeatures = prevFeatureSet.features.map((feature) =>
                feature.column === columnName ? { ...feature, transformation: transformer } : feature
            );
            return {
                ...prevFeatureSet,
                features: updatedFeatures,
            };
        });
    };

    const columns = [
        {
            dataIndex: "column",
            title: "Column",
            key: "column",
        },
        {
            dataIndex: "data_type",
            title: "Type",
            key: "data_type",
            render: (text, record) => (
                <Select
                    options={typeOptions}
                    value={text}
                    onChange={(value) => handleDataTypeChange(value, record.column)}
                />
            ),
        },
        {
            dataIndex: "count",
            title: "Count",
            key: "count",
        },
        {
            dataIndex: "unique",
            title: "Unique Values",
            key: "unique",
        },
        {
            dataIndex: "missing",
            title: "Missing",
            key: "missing",
            render: (text) => <span>{text}%</span>,
        },
        {
            dataIndex: "mean_mode",
            title: "Mean/Mode",
            key: "mean_mode",
            render: (text) => <span>{typeof text === "number" ? text.toFixed(4) : text}</span>,
        },
        {
            dataIndex: "suggest_transformer",
            title: "Transformer",
            key: "suggest_transformer",
            render: (text, record) => {
                const transformerOptions = getTransformerOptions(record.data_type);
                return (
                    <Select
                        options={transformerOptions}
                        value={text}
                        onChange={(value) => handleTransformerChange(value, record.column)}
                    />
                );
            },
        },
    ];

    return (
        <div style={{ marginTop: 16, marginBottom: 16 }}>
            <div style={{
                marginBottom: 16,
            }}>
                <em>Passthrough transformer will not transform values in series. </em>
                <em>Only use Label Encoder for target column if you want to encode categorical variable.</em>
            </div>
            <Table
                columns={columns}
                dataSource={tableData}
                rowKey="column"
                pagination={false}
                rowSelection={{
                    selectedRowKeys,
                    onChange: (selectedKeys, selectedRows) => {
                        setSelectedRowKeys(selectedKeys);
                        const features = selectedRows.map((item) => ({
                            column: item.column,
                            data_type: item.data_type,
                            transformation: item.suggest_transformer,
                        }));
                        setFeatureSet((prevFeatureSet) => ({
                            ...prevFeatureSet,
                            features: features,
                        }));
                    },
                }}
            />
        </div>
    );
};

export default DataValidation;
