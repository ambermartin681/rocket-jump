param(
    [string]$Folder = "..\frontend\src"
)

$files = Get-ChildItem -Path $Folder -Recurse -Include *.ts,*.tsx
$issueCount = 0
$issues = @()

foreach ($file in $files) {
    if ($issueCount -ge 150) { break }
    if ($file.FullName -match "test" -or $file.FullName -match "stories") { continue }
    
    $content = Get-Content $file.FullName -Raw
    # We will use regex to find functions and replace their bodies.
    # To handle brace counting, we can do it via a simple custom loop.
    
    $lines = $content -split "`r?`n"
    $out = @()
    $inFunc = $false
    $braceCount = 0
    $funcName = ""
    $buffer = @()
    $modified = $false
    
    foreach ($line in $lines) {
        if (-not $inFunc) {
            $out += $line
            # check for function start
            if ($line -match "^(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s+([a-zA-Z0-9_]+)\s*\(" -or 
                $line -match "^(?:export\s+)?(?:default\s+)?const\s+([a-zA-Z0-9_]+)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>\s*\{") {
                
                $funcName = $matches[1]
                $opens = ([regex]::Matches($line, "\{")).Count
                $closes = ([regex]::Matches($line, "\}")).Count
                $braceCount = ($opens - $closes)
                
                if ($braceCount -gt 0) {
                    $inFunc = $true
                    $buffer = @()
                }
            }
        } else {
            $opens = ([regex]::Matches($line, "\{")).Count
            $closes = ([regex]::Matches($line, "\}")).Count
            $braceCount += ($opens - $closes)
            
            if ($braceCount -le 0) {
                # End of function found
                $issueCount++
                if ($file.Extension -eq '.tsx') {
                    $out += "  return <div>TODO: Issue #$issueCount ($funcName)</div>;"
                } else {
                    $out += "  throw new Error('TODO: Issue #$issueCount ($funcName)');"
                }
                
                # If there are residual closing braces on this line that match the function end
                # we just append the line (which usually is just '}')
                $out += $line
                
                $inFunc = $false
                $code = $buffer -join "`n"
                
                $obj = [PSCustomObject]@{ 
                    IssueNum = $issueCount; 
                    Function = $funcName; 
                    File = $file.FullName.Replace("c:\Users\USER\Downloads\rocket-jump-main\", ""); 
                    Original = $code 
                }
                $issues += $obj
                $modified = $true
                
                if ($issueCount -ge 150) { break }
            } else {
                $buffer += $line
            }
        }
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value ($out -join "`r`n")
    }
}

$jsonPath = Join-Path (Split-Path -Parent (pwd)) "generated_issues.json"
$mdPath   = Join-Path (Split-Path -Parent (pwd)) "generated_issues.md"

$issues | ConvertTo-Json -Depth 5 | Out-File -FilePath $jsonPath

$md = "# Codebase Issues (150)`n`n"
foreach ($iss in $issues) {
    $md += "## Issue #$($iss.IssueNum): Implement $($iss.Function)`n"
    $md += "**File**: `$($iss.File)`n`n"
    $md += "### Implementation Details`n"
    $md += "Restore the functionality inside the body of `$($iss.Function)`. Original code:`n`n"
    $md += "``````typescript`n$($iss.Original)`n```````n`n"
    $md += "---`n`n"
}
$md | Out-File -FilePath $mdPath

Write-Host "Done! Generated $issueCount issues."