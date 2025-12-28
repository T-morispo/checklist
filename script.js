// ページ先頭に見出しがない場合は JavaScript で追加する（HTMLにも追加済みであれば処理されません）
(() => {
  const existing = document.getElementById("main-title");
  if (!existing) {
    // htmlにmain-titleの見出しがない場合のみ以下を実行
    const h1 = document.createElement("h1");
    h1.id = "main-title";
    h1.textContent = "スノーボード必需品リスト";
    // checklist の前に挿入
    const checklistEl = document.getElementById("checklist");
    if (checklistEl && checklistEl.parentNode) {
      // checklistElが存在し、その親要素（今回の場合は<body>）も存在する場合
      checklistEl.parentNode.insertBefore(h1, checklistEl);
      // checklistElの前にh1要素を挿入
    } else {
      document.body.insertBefore(h1, document.body.firstChild);
      // checklistElが存在しない場合は、bodyの最初の子要素として挿入
    }
  }
})();

fetch("web.csv")
  // web.csvを呼び出す
  .then((response) => response.text())
  // レスポンスをテキストとして取得
  // レスポンスとはfetch関数でのリクエストに対する返答のことで、response引数に格納される
  .then((text) => {
    const lines = text
      .trim()
      // 前後の余分な空白を除去
      .split("\n")
      // 改行で分割
      .filter((line) => line.trim());
    //　空行を除去
    const headers = lines[0].split(",").map((h) => h.trim());
    // lines[0]="name,image,link"
    // ↓.split(",")で["name","image","link"]配列を返す
    //　.map((h) => h.trim())で各要素の前後の空白を除去
    // headersはCSVデータの列名リスト
    // これを指定しておくことで、のちの処理で各データが何を示しているのか対応付けられる（見出しのような役割）
    const checklist = document.getElementById("checklist");
    // HTML の <ul id="checklist"> 要素を取得し、
    // ここにリスト要素を追加していく

    lines.slice(1).forEach((line, idx) => {
      // 最初の行を除いた各行に同じ処理を繰り返す
      // 以下の処理を各行に対して実行（CSVデータを各行自動で処理するように設定）
      // line=現在処理している1行のデータ
      // idx=現在の行番号(0,1,2,3,）
      const parts = line.split(",");
      // CSVの最初の2つのカンマで分割（name, image, link...の順）
      const data = {
        // 一行分のデータをオブジェクトにまとめる
        name: parts[0].trim(),
        // 一つ目の要素を取り出し、余分な空白を削除
        image: parts[1].trim(),
        // 二つ目の要素を取り出し、空白を削除
        message: parts[2].trim(),
        link: parts.slice(3).join(",").trim(),
        // URLに含まれるカンマに対応
        // URL内にカンマが含まれていても、正しくまとめてlink要素を取得
      };
      // 1行をname,image,linkの3つに整理して使いやすくする処理

      const li = document.createElement("li");
      li.className = "checklist-item";
      // <li>要素を作成し、クラス名を設定

      // ヘッダー（チェックボックス + タイトル）
      const header = document.createElement("div");
      header.className = "checklist-header";
      // <div>要素を作成し、クラス名を設定

      const checkbox = document.createElement("input");
      // <input>要素を作成
      checkbox.id = `cb-${idx}`;
      // 作成したチェックボックスにID（識別番号）をつける
      // 例えば1番目ならcb-0、2番目ならcb-1のように、自動的に番号が付く
      checkbox.type = "checkbox";
      // <input>要素がチェックボックスであることを指定

      const label = document.createElement("label");
      // <label>要素を作成
      // フォームの要素の見出しを表すタグ
      label.htmlFor = `cb-${idx}`;
      // label要素が対応するチェックボックスのIDを指定
      label.className = "checklist-title";
      label.textContent = data.name;
      // textContentプロパティでラベルの表示テキストを設定
      // dataというオブジェクトの中にあるnameプロパティの値を表示

      header.appendChild(checkbox);
      header.appendChild(label);
      // 上記で指定した定数[header]＝<div class="checklist-header">に、
      // 子要素として[checkbox]＝<input type="checkbox">と<label class="checklist-title">を追加

      // 詳細（画像 + リンク）
      const details = document.createElement("div");
      details.className = "checklist-details";

      const imgDiv = document.createElement("div");
      imgDiv.className = "checklist-image";
      const img = document.createElement("img");
      img.src = data.image;
      img.alt = data.name;
      // alt属性は画像の説明できスト。画像が表示されない場合や、スクリーンリーダーで読み上げる際に使用される
      imgDiv.appendChild(img);
      details.appendChild(imgDiv);

      // 各アイテムの説明
      const message = document.createElement("p");
      message.id = `cb-${idx}`;
      message.className = "checklist-message";
      message.textContent = "" + data.message;
      details.appendChild(message);

      // リンクは URL がある場合のみ表示
      if (data.link && data.link.length > 0) {
        // &&はすべてのオペラントがtrueの場合にtrueを返す
        const a = document.createElement("a");
        a.href = data.link;
        a.target = "_blank";
        // ユーザーが今のページを維持したまま、商品ページを新しいタブで開く設定。
        a.rel = "noopener";
        // 新しいタブから元ページへの不正なアクセスを防ぐ。(_blankとセットで使うのが基本)
        a.className = "checklist-link";
        a.textContent = "こちらから商品をチェック";
        details.appendChild(a);
      }

      li.appendChild(header);
      li.appendChild(details);
      checklist.appendChild(li);
    });
  });
