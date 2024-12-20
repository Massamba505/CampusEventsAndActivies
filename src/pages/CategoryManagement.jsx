import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { myConstant } from '../const/const';
import loadingGif from '../assets/loading.gif'

// CategoriesManagement component
const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', image: null });
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const token = JSON.parse(localStorage.getItem('events-app'))["token"];

  const fetchCategories = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(myConstant + '/api/category', {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories.');
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCategory({ ...newCategory, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditClick = (category) => {
    setEditCategory(category);
    setNewCategory({ name: category.name, image: null });
    setImagePreview(category.image);
    setModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteCategoryId(id);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true); // Start loading
    try {
      await fetch(myConstant + `/api/category/${deleteCategoryId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      setCategories(categories.filter((category) => category._id !== deleteCategoryId));
      setDeleteCategoryId(null);
      toast.success('Category deleted successfully!');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category.');
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleAddOrEditCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newCategory.name);
    if (newCategory.image) {
      formData.append('image', newCategory.image);
    }

    setLoading(true); // Start loading
    try {
      if (editCategory) {
        // Update existing category
        await fetch(myConstant + `/api/category/${editCategory._id}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
        });
        setCategories(categories.map((category) =>
          category._id === editCategory._id ? { ...category, name: newCategory.name, image: newCategory.image ? URL.createObjectURL(newCategory.image) : category.image } : category
        ));
        toast.success('Category updated successfully!');
      } else {
        // Add new category
        const response = await fetch(myConstant + '/api/category', {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
        });
        const newCategoryData = await response.json();
        setCategories([...categories, newCategoryData]);
        toast.success('Category added successfully!');
      }
    } catch (error) {
      console.error('Error adding or updating category:', error);
      toast.error('Failed to add or update category.');
    } finally {
      setLoading(false); // End loading
      // Reset modal state
      setModalOpen(false);
      setEditCategory(null);
      setNewCategory({ name: '', image: null });
      setImagePreview('');
    }
  };

  return (
    <div className="p-1">
      <h1 className="text-3xl text-center text-blue-500 font-bold mb-4">Category Management</h1>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-500 text-white p-2 rounded-lg mb-4"
      >
        Add Category
      </button>
      <h1 className='text-2xl sm:text-4xl'>Available Categories</h1>
      <hr />
      {loading ? (
        <div className="flex flex-col justify-center items-center">
          <img src={loadingGif} width={50} alt="loading..." />
          <p className="text-blue-500">Getting all categories</p>
        </div>
      ) : (
        <div className="flex mt-3 flex-wrap gap-3">
          {categories.map((category) => (
            <div key={category._id} className="border cursor-pointer hover:scale-105 transition rounded-lg p-2 shadow-lg flex flex-col items-center w-32 sm:w-40 ">
              <img src={category.image} alt={category.name} className="w-full h-16 sm:h-24 object-cover rounded-lg mb-2" />
              <h2 className="font-semibold mt-2 text-xs sm:text-sm">{category.name}</h2>
              <div className="flex space-x-2 mt-1">
                <button
                  onClick={() => handleEditClick(category)}
                  className="bg-yellow-500 hover:scale-105 transition text-white py-1 px-2 rounded-lg text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(category._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit or Add Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleAddOrEditCategory}
          newCategory={newCategory}
          onInputChange={handleInputChange}
          onFileChange={handleFileChange}
          imagePreview={imagePreview}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteCategoryId && (
        <DeleteConfirmationModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteCategoryId(null)}
        />
      )}
    </div>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, onSubmit, newCategory, onInputChange, onFileChange, imagePreview }) => {
  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-lg font-semibold mb-4">{newCategory._id ? 'Edit Category' : 'Add Category'}</h2>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              name="name"
              value={newCategory.name}
              onChange={onInputChange}
              placeholder="Category Name"
              className="border rounded-lg w-full p-2 mb-4"
              required
            />
            <input
              type="file"
              onChange={onFileChange}
              className="border rounded-lg w-full mb-4"
              accept="image/*"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg mb-4" />
            )}
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg w-full">
              {newCategory._id ? 'Update Category' : 'Add Category'}
            </button>
            <button type="button" onClick={onClose} className="text-gray-500 mt-2 w-full">
              Cancel
            </button>
          </form>
        </div>
      </div>
    )
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete this category?</p>
        <div className="flex space-x-4 mt-4">
          <button onClick={onConfirm} className="bg-red-500 text-white p-2 rounded-lg">
            Delete
          </button>
          <button onClick={onCancel} className="bg-gray-300 p-2 rounded-lg">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriesManagement;
