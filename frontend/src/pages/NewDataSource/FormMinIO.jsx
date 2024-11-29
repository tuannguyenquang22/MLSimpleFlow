import { Form, Input } from "antd";

const FormMinIO = () => {
    return (
        <Form
            layout="vertical"
            name="basic"
        >
            <h4>General</h4>
            <Form.Item label="Name">
                <Input placeholder="Enter the name for your data source" />
            </Form.Item>
            <Form.Item label="Description">
                <Input.TextArea placeholder="Enter the description for your data source" />
            </Form.Item>
            <Form.Item label="MinIO Endpoint">
                <Input placeholder="Enter the endpoint of your MinIO storage" />
            </Form.Item>
            <h4>Authentication</h4>
            <Form.Item label="Access Key">
                <Input placeholder="Enter the access key for your MinIO storage" />
            </Form.Item>
            <Form.Item label="Secret Key">
                <Input.Password placeholder="Enter the secret key for your MinIO storage" />
            </Form.Item>
            <h4>Bucket & Object</h4>
            <Form.Item label="Bucket">
                <Input placeholder="Enter the bucket name" />
            </Form.Item>
            <Form.Item label="Object">
                <Input placeholder="Enter the object name" />
            </Form.Item>
        </Form>
    )
};

export default FormMinIO;