const pluginGitCommitDate = require("eleventy-plugin-git-commit-date");

module.exports = {
  eleventyComputed: {
    title: (data) => {
      return data.title || data.page.fileSlug;
    },
    permalink: (data) => {
      if (data.permalink) {
        return data.permalink;
      }

      const result =
        data.page.filePathStem.toLowerCase().replace(/\s/g, "-") + "/";

      return result;
    },
    lastModifiedDate: (data) => {
      return pluginGitCommitDate.getGitCommitDateFromPath(data.page.inputPath);
    },
  },
};
