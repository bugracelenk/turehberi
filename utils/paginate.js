const { NEGATIVE_VALUE } = require("../err_msgs");

const setLimit = args => {
    if (args.getData.limit && args.getData.limit < 0) throw new Error(`limit${NEGATIVE_VALUE}`);
    let limit = args.getData.limit ? args.getData.limit : 20;
    if (!Number.isInteger(limit)) throw new Error("limit is not an integer");
    limit = limit > 100 ? 100 : limit;
    return limit;
};

const setSkip = args => {
    if (args.getData.skip && args.getData.skip < 0) throw new Error(`skip${NEGATIVE_VALUE}`);
    let skip = args.getData.skip ? args.getData.skip : 0;
    if (!Number.isInteger(skip)) throw new Error("skip is not an integer");

    return skip * setLimit(args);
};

const isInteger = number => {};

module.exports = { setLimit, setSkip };