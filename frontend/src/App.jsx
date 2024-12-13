import { Route, Routes } from "react-router"
import Theme from "./theme"


import HomePage from "./pages/home"
import DataPage from "./pages/data"
import ModelPage from "./pages/model"
import DeployPage from "./pages/deploy"
import ModelInsidePage from "./pages/model/model-inside"
import ModelInsideExperimentPage from "./pages/model/model-inside/experiment"
import ModelInsideOverviewPage from "./pages/model/model-inside/overview"


function App() {
    return (
        <Routes>
            <Route path="/*" element={<Theme />} >
                <Route path="home" element={<HomePage />} />
                <Route path="data/:section" element={<DataPage />} />
                <Route path="model" element={<ModelPage />} />
                <Route path="model/:user/:name/*" element={<ModelInsidePage />} >
                    <Route path="overview" element={<ModelInsideOverviewPage />} />
                    <Route path="experiment" element={<ModelInsideExperimentPage />} />
                </Route>
                <Route path="deploy" element={<DeployPage />} />
            </Route>
        </Routes>
    )
}

export default App
