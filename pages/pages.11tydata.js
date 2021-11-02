const pluginGitCommitDate = require("eleventy-plugin-git-commit-date");

module.exports = {
  eleventyComputed: {
    title: (data) => {
      return data.page.title || data.page.fileSlug;
    },
    permalink: (data) => {
      const result =
        data.page.filePathStem.toLowerCase().replace(/\s/g, "-") + "/";

      return result;
    },
    date: (data) => {
      return pluginGitCommitDate.getGitCommitDateFromPath(data.page.inputPath);
    },
  },
};
