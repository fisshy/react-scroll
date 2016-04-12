var context = require.context('./modules', true, /page-test\.js$/);
context.keys().forEach(context);
