import React, { useState, useEffect } from 'react';
import { addToast, Button, Checkbox } from '@heroui/react'; // Import Hero UI Button
import { Icon } from '@iconify/react/dist/iconify.js'; // Import Icon
import { FileManagerItem } from '../../../utils/interfaces';
import { useAppDispatch } from '../../../redux/hook';
import { ChangePermissions } from '../../../redux/slice/FIlemanagerSlice';
import { useParams } from 'react-router-dom';



// Define the props for the component
interface PermissionsProps {
  item: FileManagerItem | null;
  parentPath:string
  onClose: () => void; 
}

// Helper function to convert the symbolic permission string to a 3x3 boolean matrix
const parsePermissions = (permString: string): boolean[][] => {
  // Example permString: "-rw-r--r--"
  const perms = permString.substring(1); 
  
  const matrix: boolean[][] = [
    [false, false, false], // Owner
    [false, false, false], // Group
    [false, false, false], // Others
  ];

  for (let i = 0; i < 3; i++) {
    const start = i * 3;
    const triplet = perms.substring(start, start + 3);
    
    // Read (r) - index 0
    matrix[i][0] = triplet[0] === 'r';
    // Write (w) - index 1
    matrix[i][1] = triplet[1] === 'w';
    // Execute (x) - index 2
    matrix[i][2] = triplet[2] === 'x';
  }

  return matrix;
};

// Helper function to convert the 3x3 boolean matrix back to a symbolic permission string
const generatePermissionString = (matrix: boolean[][], fileType: string = '-'): string => {
    let permString = fileType;
    const modes = ['r', 'w', 'x'];

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            permString += matrix[i][j] ? modes[j] : '-';
        }
    }
    return permString;
};


const Permissions: React.FC<PermissionsProps> = ({ item, onClose,parentPath }) => {

    const dispatch = useAppDispatch()
    const {webid, id} = useParams()
  // State for the 3x3 permission matrix
  const [permissionsMatrix, setPermissionsMatrix] = useState<boolean[][]>(
    [
      [false, false, false], 
      [false, false, false], 
      [false, false, false],
    ]
  );
  
  // State for the resulting symbolic string
  const [newPermissionString, setNewPermissionString] = useState<string>('');
  const [newOctalPermission, setNewOctalPermission] = useState<string>('');
  
  // Effect to initialize the matrix when a new item is loaded
  useEffect(() => {
    if (item && item.permission) {
      const initialMatrix = parsePermissions(item.permission);
      const octal = convertToOctalPermissions(initialMatrix);
      setPermissionsMatrix(initialMatrix);
      setNewPermissionString(item.permission);
      setNewOctalPermission(octal);
    }
  }, [item]);

  if (!item) {
    return <div className="text-default-500">No file selected for permission update.</div>;
  }

  // Handle the checkbox toggle
  const handlePermissionChange = (userIndex: number, modeIndex: number) => {
    // Create a deep copy of the current matrix
    const newMatrix = permissionsMatrix.map(row => [...row]);
    
    // Toggle the specific permission
    newMatrix[userIndex][modeIndex] = !newMatrix[userIndex][modeIndex];
    
    // Update state
    setPermissionsMatrix(newMatrix);
    
    // Also update the symbolic string
    const fileType = item.permission ? item.permission[0] : '-';
    const newSymbolicString = generatePermissionString(newMatrix, fileType);
    const newOctalString = convertToOctalPermissions(newMatrix);
    setNewPermissionString(newSymbolicString);
    setNewOctalPermission(newOctalString);
  };
  
  // Display the user category labels
  const userCategories = ['Owner', 'Group', 'Others'];
  // Display the mode labels
  const permissionModes = ['Read (r)', 'Write (w)', 'Execute (x)'];



  const convertToOctalPermissions = (matrix: boolean[][]): string => {
    let octalString = "";
    
    for (let i = 0; i < 3; i++) { // For Owner, Group, Others
        let octalDigit = 0;
        
        // Read (4)
        if (matrix[i][0]) octalDigit += 4;
        // Write (2)
        if (matrix[i][1]) octalDigit += 2;
        // Execute (1)
        if (matrix[i][2]) octalDigit += 1;
        
        octalString += octalDigit.toString();
    }
    
    return octalString;
};

  // This function would contain your API call logic
  const handleSavePermissions = async() => {
  try {
    await dispatch(ChangePermissions({webid,serverid:id,data:{path:parentPath,name:item.name,permissions:newOctalPermission},permisionstring:newPermissionString})).unwrap()
    addToast({ description: 'Permissions updated successfully', color: 'success' });
    onClose();
  } catch (error) {
    addToast({ description: error, color: 'danger' });
  }

  };


  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <h2 className="text-lg font-semibold flex items-center gap-2 text-default-900">
        <Icon icon="lucide:key-round" width={20} className="text-primary-500" />
        Change File Permissions
      </h2>
      
      {/* File Information Card */}
      <div className="bg-default-50 dark:bg-default-100/50 p-3 rounded-lg text-sm border border-default-200">
        <div className="truncate text-default-700">
          <span className="font-semibold">File:</span> {item.name}
        </div>
        <div className="truncate text-default-700">
          <span className="font-semibold">Path:</span> {item.path}
        </div>
        <div className="mt-2 flex flex-col sm:flex-row sm:justify-between sm:items-center border-t border-default-200 pt-2">
            <div className='text-xs text-default-500'>
                Current: <code className="text-default-700 dark:text-default-500 font-mono">{item.permission}</code>
            </div>
            <div className='text-sm text-primary-600 dark:text-primary-400 font-bold mt-1 sm:mt-0'>
                New: <code className="font-mono">{newPermissionString}</code>
            </div>
      </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="border border-default-200 dark:border-default-500 rounded-lg overflow-hidden">
        <table className="w-full table-fixed text-left text-sm">
          <thead>
            <tr className="bg-default-100 dark:bg-default-100/70 border-b border-default-200 dark:border-default-500">
              <th className="p-3 text-xs font-medium text-default-600 w-2/5">Mode</th>
              {permissionModes.map((mode, index) => (
                <th key={index} className="p-3 text-xs font-medium text-default-600 text-center w-1/5">{mode}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissionsMatrix.map((row, userIndex) => (
              <tr 
                key={userIndex} 
                className={`border-b border-default-100 last:border-b-0 transition-colors ${userIndex % 2 === 1 ? 'bg-white dark:bg-default-50/50' : 'bg-default-50 dark:bg-default-100/50'}`}
              >
                <td className="p-3 text-default-800">
                  <strong className='text-sm'>{userCategories[userIndex]}</strong>
                </td>
                {row.map((isChecked, modeIndex) => (
                  <td key={modeIndex} className="p-3 text-center">
                   
                    {/* <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handlePermissionChange(userIndex, modeIndex)}
                      className="form-checkbox w-4 h-4 text-primary-500 bg-gray-100 border-default-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                    /> */}
                    <Checkbox
                    isSelected={isChecked}
                    
                    onChange={() => handlePermissionChange(userIndex, modeIndex)}
                    size='sm'
                    />
                  
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button 
            variant="flat" 
            size="sm"
            onPress={onClose} // Use the passed onClose prop
        >
          Cancel
        </Button>
        <Button 
          color="primary"
          size="sm"
          onPress={handleSavePermissions}
          // Disable if the symbolic string hasn't changed
          isDisabled={item.permission === newPermissionString}
        >
          Save Permissions ({newOctalPermission})
        </Button>
      </div>
    </div>
  );
};

export default Permissions;