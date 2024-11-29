import { Result, Table } from "antd";

const ReviewFeatureSet = ({ status }) => {
    return (
        <div>
            <Result status={status} title={"Create new feature set"} />
        </div>
    );
};

export default ReviewFeatureSet;