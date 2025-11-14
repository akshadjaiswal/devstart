import validatePackageName from 'validate-npm-package-name';
import fs from 'fs-extra';
import path from 'path';

export function validateProjectName(name) {
  const validation = validatePackageName(name);

  if (!validation.validForNewPackages) {
    const errors = [
      ...(validation.errors || []),
      ...(validation.warnings || [])
    ];
    return {
      valid: false,
      message: `Invalid project name: ${errors.join(', ')}`
    };
  }

  return { valid: true };
}

export function validateProjectPath(projectPath) {
  if (fs.existsSync(projectPath)) {
    return {
      valid: false,
      message: `Directory "${projectPath}" already exists. Please choose a different name.`
    };
  }

  // Check if we can write to the parent directory
  const parentDir = path.dirname(projectPath);
  try {
    fs.accessSync(parentDir, fs.constants.W_OK);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      message: `No write permission for directory "${parentDir}"`
    };
  }
}
