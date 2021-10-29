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
  },
};
