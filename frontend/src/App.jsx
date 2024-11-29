import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ModelDetail from "./pages/ModelDetail";

const Theme = lazy(() => import("./theme/Theme"));
const FeatureSet = lazy(() => import("@/pages/FeatureSet"));
const DataSource = lazy(() => import("@/pages/DataSource"));
const NewDataSource = lazy(() => import("@/pages/NewDataSource"));
const NewFeatureSet = lazy(() => import("@/pages/NewFeatureSet"));
const Model = lazy(() => import("@/pages/Model"));
const NewModel = lazy(() => import("@/pages/NewModel"));


const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Theme />}>
                <Route path="home" element={<div>Home</div>} />
                <Route path="feature-set" element={<FeatureSet />} />
                <Route path="feature-set/new" element={<NewFeatureSet />} />
                <Route path="data-source" element={<DataSource />} />
                <Route path="data-source/new" element={<NewDataSource />} />
                <Route path="model" element={<Model />} />
                <Route path="model/:id" element={<ModelDetail />} />
                <Route path="model/new" element={<NewModel />} />
            </Route>
        </Routes>
    )
}

export default App;