# Fish Sort Puzzle GDD Wiki (static)

Site tĩnh sinh bởi `GameDesign/tools/gd_site.py`. Mở `index.html` hoặc publish lên GitHub Pages:

```bash
cd site
git init && git add -A && git commit -m "GDD wiki"
git branch -M gh-pages
git remote add origin <repo-url>
git push -u origin gh-pages
```

Trong Settings → Pages của repo chọn nhánh `gh-pages`, thư mục `/`. Không cần build; file `.nojekyll` đã có.
