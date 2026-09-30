<#
.SYNOPSIS
    Ralph Loop runner for Windows PowerShell.
.DESCRIPTION
    Executes an autonomous agent loop with max iterations, circuit breaker,
    and completion detection.
.PARAMETER Prompt
    The prompt text or path to a prompt markdown file.
.PARAMETER MaxIterations
    The maximum number of loop iterations before stopping (default: 10).
.PARAMETER AgentCommand
    The command to run for the AI agent (e.g., 'claude', 'agy', or custom script).
#>
param (
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Prompt,

    [Parameter(Position = 1)]
    [int]$MaxIterations = 10,

    [Parameter(Position = 2)]
    [string]$AgentCommand = "claude"
)

$iteration = 1
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Starting Ralph Loop (Max: $MaxIterations iterations)" -ForegroundColor Cyan
Write-Host " Agent: $AgentCommand" -ForegroundColor Cyan
Write-Host " Prompt: $Prompt" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

while ($iteration -le $MaxIterations) {
    Write-Host "`n[Ralph Loop] Iteration $iteration of $MaxIterations..." -ForegroundColor Yellow

    try {
        if (Test-Path $Prompt) {
            $content = (Get-Content $Prompt -Raw).Trim()
            Invoke-Expression "$AgentCommand `"$content`""
        } else {
            Invoke-Expression "$AgentCommand `"$Prompt`""
        }
        $exitCode = if ($LASTEXITCODE -ne $null) { $LASTEXITCODE } else { 0 }
    } catch {
        Write-Host "Error executing agent command: $_" -ForegroundColor Red
        $exitCode = 1
    }
    if ($exitCode -eq 0) {
        Write-Host "`n[Ralph Loop] Success! Task completed cleanly on iteration $iteration." -ForegroundColor Green
        break
    } else {
        Write-Host "`n[Ralph Loop] Iteration $iteration exited with code $exitCode. Retrying..." -ForegroundColor DarkYellow
    }

    $iteration++
    Start-Sleep -Seconds 2
}

if ($iteration -gt $MaxIterations) {
    Write-Host "`n[Ralph Loop] Reached max iterations ($MaxIterations). Circuit breaker engaged." -ForegroundColor Red
}
