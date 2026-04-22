(function () {
  const subjectList = document.getElementById("subjectList");
  const sheetList = document.getElementById("sheetList");
  const sheetTitle = document.getElementById("sheetTitle");
  const sheetCount = document.getElementById("sheetCount");

  const entries = Array.isArray(window.REVISION_FILES) ? window.REVISION_FILES : [];

  if (!entries.length) {
    subjectList.innerHTML = "<p class=\"empty\">No subjects available yet.</p>";
    sheetList.innerHTML = "<p class=\"empty\">Add items in filesData.js to get started.</p>";
    return;
  }

  const groupedBySubject = entries.reduce((map, item) => {
    const subject = (item.subject || "Uncategorized").trim() || "Uncategorized";

    if (!map.has(subject)) {
      map.set(subject, []);
    }

    map.get(subject).push(item);
    return map;
  }, new Map());

  const subjects = Array.from(groupedBySubject.keys()).sort((a, b) =>
    a.localeCompare(b)
  );

  function renderSubjectButtons(activeSubject) {
    subjectList.innerHTML = "";

    subjects.forEach((subject) => {
      const button = document.createElement("button");
      button.className = "subject-btn" + (subject === activeSubject ? " active" : "");
      button.type = "button";
      button.textContent = subject;
      button.addEventListener("click", function () {
        renderSheets(subject);
        renderSubjectButtons(subject);
      });
      subjectList.appendChild(button);
    });
  }

  function renderSheets(subject) {
    const files = groupedBySubject.get(subject) || [];
    sheetTitle.textContent = subject + " Revision Sheets";
    sheetCount.textContent = files.length === 1 ? "1 file" : files.length + " files";

    if (!files.length) {
      sheetList.innerHTML = "<p class=\"empty\">No files found for this subject.</p>";
      return;
    }

    sheetList.innerHTML = "";

    files.forEach((item) => {
      const card = document.createElement("article");
      card.className = "sheet-card";

      const name = document.createElement("h3");
      name.className = "sheet-name";
      name.textContent = item.name || "Untitled file";

      const meta = document.createElement("p");
      meta.className = "sheet-meta";
      meta.textContent = "Date: " + (item.date || "Not set");

      const link = document.createElement("a");
      link.className = "download-btn";
      link.textContent = "Download";
      link.href = "files/" + encodeURIComponent(item.file || "");
      link.setAttribute("download", item.file || "");

      card.appendChild(name);
      card.appendChild(meta);
      card.appendChild(link);
      sheetList.appendChild(card);
    });
  }

  const firstSubject = subjects[0];
  renderSubjectButtons(firstSubject);
  renderSheets(firstSubject);
})();
