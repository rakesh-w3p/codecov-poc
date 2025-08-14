# Branch Protection Setup

To enforce that PRs must pass lint and test checks before merging, you need to configure branch protection rules in your GitHub repository.

## Option 1: Using GitHub Web Interface

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Branches**
3. Click **Add rule** next to "Branch protection rules"
4. Configure the following settings:

### Branch Protection Rule Configuration

- **Branch name pattern**: `main`
- **Protect matching branches**: ✅ Checked

#### Required Status Checks
- ✅ **Require status checks to pass before merging**
- ✅ **Require branches to be up to date before merging**

**Select the following status checks** (these will appear after your first CI run):
- `Lint Code`
- `Test Suite (18.x)`
- `Test Suite (20.x)`
- `Security Audit`
- `PR Requirements Check`

#### Additional Recommended Settings
- ✅ **Require pull request reviews before merging**
- ✅ **Dismiss stale pull request approvals when new commits are pushed**
- ✅ **Restrict pushes that create files that have a path longer than this limit**
- ✅ **Do not allow bypassing the above settings**

## Option 2: Using GitHub CLI

Run this command to set up branch protection via CLI:

```bash
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Lint Code","Test Suite (18.x)","Test Suite (20.x)","Security Audit","PR Requirements Check"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null
```

## Option 3: Using Repository Settings API

You can also use the GitHub API directly with a personal access token:

```bash
curl -X PUT \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/OWNER/REPO/branches/main/protection \
  -d '{
    "required_status_checks": {
      "strict": true,
      "contexts": [
        "Lint Code",
        "Test Suite (18.x)",
        "Test Suite (20.x)",
        "Security Audit",
        "PR Requirements Check"
      ]
    },
    "enforce_admins": true,
    "required_pull_request_reviews": {
      "required_approving_review_count": 1,
      "dismiss_stale_reviews": true
    },
    "restrictions": null
  }'
```

## Verification

After setting up branch protection:

1. Create a test branch: `git checkout -b test-branch-protection`
2. Make a small change and push
3. Open a PR to main
4. Verify that the "Merge" button is disabled until all checks pass
5. Check that the PR shows required status checks

## Status Check Names

The GitHub Actions workflow creates these status checks:
- **Lint Code** - ESLint validation
- **Test Suite (18.x)** - Tests on Node.js 18.x
- **Test Suite (20.x)** - Tests on Node.js 20.x  
- **Security Audit** - npm security audit
- **PR Requirements Check** - Overall validation that all checks passed

## Troubleshooting

If status checks don't appear:
1. Push a commit to trigger the workflow
2. Wait for the workflow to complete
3. Check the Actions tab for any errors
4. Ensure the workflow file is in `.github/workflows/` and properly formatted