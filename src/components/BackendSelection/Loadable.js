/**
 *
 * Asynchronously loads the component for BackendSelection
 *
 */

import loadable from "utils/loadable";

export default loadable(() => import("./index"));
