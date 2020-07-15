import schema from './schema';

import frSchema from '@/outter/fr-schema/src';

const { createApi, utils } = frSchema;

// user func
let permission = createApi('user_auth/permission', schema);

// return
export default permission;
