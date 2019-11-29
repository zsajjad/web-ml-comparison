/**
*
* Asynchronously loads the component for Chart
*
*/

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));