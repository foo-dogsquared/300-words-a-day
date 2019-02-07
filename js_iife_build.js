const fs = require("fs");
const js_files = ["./js_build/client_app.js", "./js_build/render_notes.js"];
const path = require("path");

for (const file of js_files) {
    const source_code = fs.readFileSync(file);
    const iife_fied_source = `(function(){${source_code}}());`
    const file_ext = path.extname(file);
    const file_name = path.basename(file);
    fs.writeFileSync(path.join(__dirname, `./final_js_build/${file_name.slice(0, file_name.length - file_ext.length)}.iife.js`), iife_fied_source);
}
