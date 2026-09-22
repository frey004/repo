const plugin = {
  id: "skynovels",
  name: "SkyNovels",
  icon: "https://raw.githubusercontent.com/frey004/repo/main/icons/skynovels.png",
  site: "https://www.skynovels.net/",
  version: "1.0.0",
  lang: "Spanish",

  async popularNovels(page) {
    const url = `${this.site}novels?page=${page}`;
    const result = await fetch(url);
    const body = await result.text();

    const loadedCheerio = cheerio.load(body);
    const novels = [];

    loadedCheerio(".novel-card, .card").each((i, el) => {
      const name = loadedCheerio(el).find(".novel-title, h2").text().trim();
      const cover = loadedCheerio(el).find("img").attr("src");
      const path = loadedCheerio(el).find("a").attr("href");

      novels.push({ name, cover, path });
    });

    return novels;
  },

  async parseNovel(novelPath) {
    const url = `${this.site}${novelPath}`;
    const result = await fetch(url);
    const body = await result.text();

    const loadedCheerio = cheerio.load(body);

    const novel = {
      path: novelPath,
      name: loadedCheerio(".novel-title, h1").text().trim(),
      cover: loadedCheerio(".novel-cover img").attr("src"),
      summary: loadedCheerio(".novel-synopsis, .description").text().trim(),
      author: loadedCheerio(".novel-author").text().trim(),
      status: "Unknown",
      genres: "",
      chapters: [],
    };

    const chapters = [];
    loadedCheerio(".chapter-list a, .chapters-list a").each((i, el) => {
      const chapterName = loadedCheerio(el).text().trim();
      const chapterPath = loadedCheerio(el).attr("href");

      chapters.push({
        name: chapterName,
        path: chapterPath,
        releaseTime: null,
      });
    });

    novel.chapters = chapters;
    return novel;
  },

  async parseChapter(chapterPath) {
    const url = `${this.site}${chapterPath}`;
    const result = await fetch(url);
    const body = await result.text();

    const loadedCheerio = cheerio.load(body);
    return loadedCheerio(".chapter-content, #content").html();
  },

  async searchNovels(searchTerm, page) {
    const url = `${this.site}search?q=${encodeURIComponent(searchTerm)}&page=${page}`;
    const result = await fetch(url);
    const body = await result.text();

    const loadedCheerio = cheerio.load(body);
    const novels = [];

    loadedCheerio(".search-results .novel-card").each((i, el) => {
      const name = loadedCheerio(el).find(".novel-title").text().trim();
      const cover = loadedCheerio(el).find("img").attr("src");
      const path = loadedCheerio(el).find("a").attr("href");

      novels.push({ name, cover, path });
    });

    return novels;
  }
};

export default plugin;
