const utils = require('../utils');
const colors = require('colors/safe');

const validate = (context) => {
  context.line('Validating project locally.\n');
  return Promise.resolve()
    .then(() => utils.localAppCommand({command: 'validate'}))
    .then((errors) => {
      const newErrors = errors.map(({property, message, docLinks}) => {
        return {
          property,
          message,
          docLinks: (docLinks || []).join('\n')
        };
      });
      const ifEmpty = colors.grey('No errors found during validation routine.');
      utils.printData(newErrors, [
        ['Property', 'property'],
        ['Message', 'message'],
        ['Links', 'docLinks'],
      ], ifEmpty, true);
      return errors;
    })
    .then((errors) => {
      if (errors.length) {
        context.line(`\nMake any changes to your project and rerun this command.`);
      } else {
        context.line(`\nThis project looks good!`);
      }
    });
};
validate.help = 'Validates the current project.';
validate.example = 'zapier validate';
validate.docs = `\
Runs the standard validation routine powered by json-schema that checks your app for any structural errors. This is the same routine that is run during \`zapier build\`, \`zapier uploard\`, \`zapier push\` or even as a test in \`npm test\`.

**Options**

${utils.defaultOptionsDocFragment({cmd: 'validate'})}

${'```'}bash
$ zapier validate
# Validating project locally.
# 
# No errors found during validation routine.
# 
# This project looks good!

$ zapier validate
# Validating project locally.
# 
# ┌───────────────────────────────────────────────────────────────────────────────────────────────┐
# │ = 1 =                                                                                         │
# │     Property │ instance                                                                       │
# │     Message  │ requires property "platformVersion"                                            │
# │     Links    │ https://github.com/zapier/zapier-platform-schema/blob/v3.0.0/docs.md#appschema │
# └──────────────┴────────────────────────────────────────────────────────────────────────────────┘
# 
# Make any changes to your project and rerun this command.
${'```'}
`;

module.exports = validate;
