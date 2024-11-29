import { Form, Input, Select } from "antd";
import { useGetDataSourcesQuery } from "@/store/api/datasource/dataSourceApiSlice";
import Loading from "@/components/Loading";
import { useState } from "react";

const ChooseSource = ({ featureSet, setFeatureSet }) => {
    const { data, error, isLoading, isSuccess } = useGetDataSourcesQuery();
    const [dataSource, setDataSource] = useState(null);

    if (isLoading) {
        return <Loading />
    };

    if (isSuccess) {
        const dataSources = data.data;
        const options = dataSources.map((item) => ({
            label: `${item.name} (${item._id})`,
            value: item._id,
        }));

        const handleChange = (value) => {
            const found = dataSources.find((item) => item._id === value);
            if (found) {
                setDataSource(found);
            }
            setFeatureSet({ ...featureSet, datasource_id: value, collection: null });            
        };

        const handleChangeCollection = (value) => {
            setFeatureSet({ ...featureSet, collection: value });
        };

        return (
            <Form layout="vertical">
                <Form.Item label="Data Source">
                    <Select
                        value={featureSet.datasource_id}
                        placeholder="Select a data source"
                        options={options}
                        onChange={handleChange}
                    />
                </Form.Item>
                {dataSource && dataSource.origin === "mysql" && (
                    <Form.Item label="Table or View">
                        <Select 
                            value={featureSet.collection}
                            placeholder="Select a table"
                            onChange={handleChangeCollection}
                            options={dataSource.collection.map((item) => ({
                                label: item,
                                value: item,
                            }))}
                        />
                    </Form.Item>
                )}

            </Form>
        );
    }
};

export default ChooseSource;