$readme = Get-Content README.md
$readme[161] = "## 🛠️ Tech Stack"
$readme[310] = "## 📁 Project Structure"
$readme | Set-Content README.md
