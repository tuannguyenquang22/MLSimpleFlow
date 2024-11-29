const { Modal, Descriptions, Table } = require("antd");

const FeatureSetDetail = ({ featureSet, open, onCancel }) => {
    return (
        <Modal
            title={featureSet.name}
            open={open}
            onCancel={onCancel}
            footer={null}
        >
            <Descriptions bordered>
                <Descriptions.Item label="Key">
                    {featureSet._id.slice(-8)}
                </Descriptions.Item>
                <Descriptions.Item label="Name">
                    {featureSet.name}
                </Descriptions.Item>
                <Descriptions.Item label="Number of Features">
                    {featureSet.n_features}
                </Descriptions.Item>
                <Descriptions.Item label="Modified At">
                    {new Date(featureSet.modified).toLocaleString()}
                </Descriptions.Item>
            </Descriptions>
            <Table 
                style={{
                    marginTop: 20
                }}

            />
        </Modal>
    )
};

export default FeatureSetDetail;