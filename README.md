# s-concepts
Simple scraper of graydient concepts page. Outputs an html file of all the concepts.  
![](preview.png)

Could use a custom backend with requests to avoid serving up descriptions, but whatever?  
I use `bun` to run the server, but it should work with node.  
  
```bash
bun run index.ts
```
It will scrape on the first launch.  
You can also run  
```bash
bun run index.ts scrape
```
to force a scrape.
