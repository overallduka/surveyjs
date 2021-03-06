import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `text`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .click(`body`);
        });

    test(`fill text field`, async t => {
        let surveyResult;

        await t
            .typeText(`input[type=email]`, `stub@gmail.com`)
            .click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult, {
            "email":"stub@gmail.com"
        });
    });

    if (framework.indexOf("bootstrap") === -1) {
        test(`change size`, async t => {
            const getWidth = ClientFunction(() =>
                document.querySelector('input[type=email]').clientWidth);
            let oldWidth;
            let newWidth;

            oldWidth = await getWidth();

            await t
                .click(`#change_size_to_10`);

            newWidth = await getWidth();

            assert(oldWidth > newWidth);
        });
    }

    test(`check input types`, async t => {
        const types = ["color", "date", "datetime", "datetime-local", "email", "month", "password", "range", "tel",
            "text", "time", "url", "week"];

        for (let i=0; i< types.length; i++) {
           await t
               .hover(`input[type=${types[i]}]`);
        }
    });
});