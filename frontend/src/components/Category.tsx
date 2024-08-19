import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useState, useEffect, useRef } from 'react';
import { ColDef } from 'ag-grid-community';
import { Button, Modal, Col, Alert, Form } from 'react-bootstrap';
import { useForm, SubmitHandler } from 'react-hook-form';

interface CategoryData {
  category_id?: string;
  category_name: string;
  description: string;
}

function Category() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<CategoryData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const gridRef = useRef<AgGridReact<CategoryData>>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CategoryData>({
    defaultValues: {
      category_name: '',
      description: ''
    }
  });

  useEffect(() => {
    const fetchCategorys = async () => {
      try {
        const res = await axios.get<CategoryData[]>('http://localhost:5000/api/categories');
        setCategories(res.data);
      } catch (error) {
        setError('Failed to fetch data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategorys();
  }, []);

  const handleAddCategory: SubmitHandler<CategoryData> = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post<CategoryData>('http://localhost:5000/api/categories/add', data);
      setCategories((prevCategorys) => [...prevCategorys, res.data]);
      reset();
      setIsModalOpen(false);
      gridRef.current?.api.refreshCells();
    } catch (error: any) {
      setError(error.response.data.msg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory: SubmitHandler<CategoryData> = async (data) => {
    if (!currentCategory) return;
    setLoading(true);
    try {
      const res = await axios.put<CategoryData>(
        `http://localhost:5000/api/categories/edit/${currentCategory.category_id}`,
        {
          category_name: data.category_name,
          description: data.description
        }
      );
      setCategories((prevCategorys) =>
        prevCategorys.map((category) =>
          category.category_id === currentCategory.category_id ? res.data : category
        )
      );
      reset();
      setIsModalOpen(false);
      setIsEditMode(false);
      gridRef.current?.api.refreshCells();
    } catch (error: any) {
      setError(error.response.data.msg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (category_id: number) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/categories/delete/${category_id}`);
      setCategories((prevCategorys) => prevCategorys.filter((category) => category.category_id !== category_id.toString()));
    } catch (error: any) {
      setError(error.response.data.msg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setIsEditMode(false);
    reset();
    setIsModalOpen(true);
  };

  const openEditModal = (category: CategoryData) => {
    setCurrentCategory(category);
    setIsEditMode(true);
    setIsModalOpen(true);
    Object.keys(category).forEach((key) => setValue(key as keyof CategoryData, category[key as keyof CategoryData]));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
  };

  const renderActionsCell = (params: any) => (
    <div>
      <Button variant="warning" onClick={() => openEditModal(params.data)}>
        Edit
      </Button>{' '}
      <Button variant="danger" onClick={() => handleDeleteCategory(params.data.category_id)}>
        Delete
      </Button>
    </div>
  );

  const columnDefs: ColDef<CategoryData>[] = [
    { headerName: 'Category', field: 'category_name' },
    { headerName: 'Description', field: 'description' },
    {
      headerName: 'Actions',
      cellRenderer: (params: any) => renderActionsCell(params),
    },
  ];

  return (
    <div className="category-container">
      <h2 className="mb-3 text-center">
        <b>List of Categories</b>
      </h2>
      <Button variant="primary mb-3" onClick={openModal}>
        Create Category
      </Button>
      <Modal show={isModalOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? 'Edit Category' : 'Create Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(isEditMode ? handleEditCategory : handleAddCategory)}>
            <Form.Group controlId="category_name">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                {...register('category_name', { required: 'Category name is required' })}
                placeholder="Category Name"
                isInvalid={!!errors.category_name}
              />
              {errors.category_name && <Form.Control.Feedback type="invalid">{errors.category_name.message}</Form.Control.Feedback>}
            </Form.Group>
            <Form.Group controlId="country">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="textarea"
                {...register('description', { required: 'Description is required' })}
                placeholder="Description"
                isInvalid={!!errors.description}
              />
              {errors.description && <Form.Control.Feedback type="invalid">{errors.description.message}</Form.Control.Feedback>}
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                {isEditMode ? 'Save Changes' : 'Add Category'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
      <div className="table-responsive">
        {error && (
          <Col lg={10} className="mx-auto mb-4">
            <Alert variant="danger" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          </Col>
        )}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="ag-theme-alpine" style={{ height: '70vh' }}>
            <AgGridReact<CategoryData>
              ref={gridRef}
              rowData={categories}
              columnDefs={columnDefs}
            ></AgGridReact>
          </div>
        )}
      </div>
    </div>
  );
}

export default Category;
