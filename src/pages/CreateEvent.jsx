import { useState } from 'react';
import { Form, Button, Container, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    start_time: '',
    end_time: '',
    is_paid: false,
    ticket_price: 0,
    max_attendees: '',
    category: ''
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    setImageFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation (you can add more if necessary)
    if (!formData.title || !formData.description || !formData.date || !formData.start_time || !formData.end_time) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      // Append ticket_price only if the event is paid
      if (key !== 'ticket_price' || formData.is_paid) {
        form.append(key, formData[key]);
      }
    });
    Array.from(imageFiles).forEach((file) => {
      form.append('images', file);
    });

    try {
      const response = await fetch('/api/events/new', {
        method: 'POST',
        body: form,
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || 'Event created successfully');
        // Reset form on success
        setFormData({
          title: '',
          description: '',
          location: '',
          date: '',
          start_time: '',
          end_time: '',
          is_paid: false,
          ticket_price: 0,
          max_attendees: '',
          category: '',
        });
        setImageFiles([]);
      } else {
        toast.error(data.error || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h2>Create New Event</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Start Time</Form.Label>
          <Form.Control
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>End Time</Form.Label>
          <Form.Control
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            name="is_paid"
            label="Paid Event"
            checked={formData.is_paid}
            onChange={handleChange}
          />
          {formData.is_paid && (
            <Form.Group className="mb-3">
              <Form.Label>Ticket Price</Form.Label>
              <Form.Control
                type="number"
                name="ticket_price"
                value={formData.ticket_price}
                onChange={handleChange}
              />
            </Form.Group>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Max Attendees</Form.Label>
          <Form.Control
            type="number"
            name="max_attendees"
            value={formData.max_attendees}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Images</Form.Label>
          <Form.Control
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Create Event'}
        </Button>
      </Form>
    </Container>
  );
};

export default CreateEvent;
