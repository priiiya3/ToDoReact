import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Table, Tag, Space, Modal, Input } from "antd";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";

function App() {
  const [list, setList] = useState(
    JSON.parse(localStorage.getItem("todoList")) || []
  );
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");
  const [searchedText, setSearchedText] = useState("");

  function getTodaysDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    if (month < 10) {
      month = "0" + month;
    }

    if (day < 10) {
      day = "0" + day;
    }

    return `${year}-${month}-${day}`;
  }

  //Column Data from antd

  const column = [
    {
      title: "TIME STAMP",
      dataIndex: "timestamp",
      key: "key",
      defaultSortOrder: 'descend',
      sorter: (a, b) => (a.timestamp.length) - (b.timestamp.length),
    },
    {
      title: "TITLE",
      dataIndex: "title",
      key: "key",
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.title.length - b.title.length,
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return record.title.toLowerCase().includes(value.toLowerCase()) ||  record.desc.toLowerCase().includes(value.toLowerCase()) || record.dueDate.toLowerCase().includes(value.toLowerCase())
      },
    },
    {
      title: "DESCRIPTION",
      dataIndex: "desc",
      key: "key",
    },
    {
      title: "DUE DATE",
      dataIndex: "dueDate",
      key: "key",
      defaultSortOrder: 'descend',
      sorter: (a, b) => (a.dueDate.length) - (b.dueDate.length),
    },
  
    {
      title: "TAGS",
      dataIndex: "tags",
      key: "key",
      render: (_, { tags }) => (
        <>
          {[...new Set(tags.split(","))].map((tag) => {
            return (
              <Tag color={"blue"} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "key",
      filters: [
        {
          text: "OPEN",
          value: "OPEN",
        },
        {
          text: "WORKING",
          value: "WORKING",
        },
        {
          text: "DONE",
          value: "DONE",
        },
        {
          text: "OVERDUE",
          value: "OVERDUE",
        },
      ],
      onFilter: (value, record) => {
        return record.status.indexOf(value) === 0;
      },
    },
    {
      title: "ACTION",
      key: "action",
      render: (_, record) => (
        <Space
          size="large"
          className="d-flex justify-content-around"
        >
          <AiFillEdit
            onClick={() => editItem(record)}
            className="fs-6 text-dark"
          />
          <AiFillDelete
            onClick={() => deleteItem(record)}
            className="fs-6 text-danger"
          />
        </Space>
      ),
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !desc || !status) {
      alert("Mandatory Field! ");
    }

    else {
      if (dueDate < getTodaysDate()) {
        setError(
          "Not Valid. Please enter a present or future date."
        );
        return;
      }
      const newItem = {
        id: new Date().toString(),
        title: title,
        desc: desc,
        dueDate: dueDate,
        tags: tags,
        timestamp: getTodaysDate(),
        status: status,
      };
      setList([...list, newItem]);
      setTitle("");
      setDesc("");
      setDueDate("");
      setTags([]);
      setStatus("OPEN");
      setError("");
      console.log(list);
    }

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    setValidated(true);
  };

  // # Delete the List Item
  const deleteItem = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this list item ?",
      onOk: () => {
        setList((pre) => {
          return pre.filter((item) => item.id !== record.id);
        });
      },
    });
  };

  // Edit the List item
  const editItem = (record) => {
    setIsEditing(true);
    setEditingItem({ ...record });
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingItem(null);
  };

  const clearList = () => {
    setList([]);
  };


  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(list));
  }, [list]);

  return (
    <div className="App">
      <div className="container">
        <div className="text-center fs-2 fw-bold text-primary"> Todo List</div>
        
        <div className="mainContainer p-2 border">
          <div className="inputContainer border p-2">
            {error && (
              <>
                <div className="bg-danger text-light text-center p-1 border-danger mb-2">
                  <strong>{error}</strong>
                </div>
              </>
            )}
            <Form
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
              className="d-flex flex-row justify-content-between align-items-center"
            >
              <Form.Group md="4" controlId="validationCustom01">
                <Form.Label className="">
                  Title
                  <span>
                    <OverlayTrigger
                      key="right"
                      placement="right"
                      overlay={
                        <Tooltip id={`tooltip-right`}>
                          <strong>at max 100 characters allowed</strong>.
                        </Tooltip>
                      }
                    >
                      <Button size="sm" className="btn btn-outline-primary ms-2" variant="btn-outline-primary">
                        <em>i</em>
                      </Button>
                    </OverlayTrigger>
                  </span>
                </Form.Label>
                <Form.Control
                  required
                  autoComplete="off"
                  type="text"
                  placeholder="Enter Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group md="4" controlId="validationCustom02">
                <Form.Label>
                  Description
                  <span>
                    <OverlayTrigger
                      key="right"
                      placement="right"
                      overlay={
                        <Tooltip id={`tooltip-right`}>
                          <strong>Max 1000 characters required</strong>.
                        </Tooltip>
                      }
                    >
                     <Button size="sm" className="btn btn-outline-primary ms-2" variant="btn-outline-primary">
                        <em>i</em>
                      </Button>
                    </OverlayTrigger>
                  </span>
                </Form.Label>
                <Form.Control
                  required
                  autoComplete="off"
                  type="text"
                  placeholder="Enter Description"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group md="4" controlId="validationCustomUsername">
                <Form.Label>Due Date:</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="date"
                    aria-describedby="inputGroupPrepend"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please choose a valid Date.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group md="6" controlId="validationCustom03">
                <Form.Label>
                  Tags
                  <span>
                    <OverlayTrigger
                      key="right"
                      placement="right"
                      overlay={
                        <Tooltip id={`tooltip-right`}>
                          <strong>
                            use commas to for adding multiple tags
                          </strong>
                        </Tooltip>
                      }
                    >
                      <Button size="sm" className="btn btn-outline-primary ms-2" variant="btn-outline-primary">
                        <em>i</em>
                      </Button>
                    </OverlayTrigger>
                  </span>
                </Form.Label>
                <Form.Control
                  type="text"
                  autoComplete="off"
                  placeholder="Your tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  
                />

              </Form.Group>
              <Form.Group md="3" controlId="validationCustom04">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  required
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>OPEN</option>
                  <option>WORKING</option>
                  <option>DONE</option>
                  <option>OVERDUE</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Please select a valid Status.
                </Form.Control.Feedback>
              </Form.Group>
              
              <Button type="submit" className="btn btn-lg btn-primary">
                Add Item
              </Button>

            </Form>
          </div>

          
          {list.length > 0 && (
            <div className="border p-2 mt-3 tablelistContainer">
              <div className="d-flex flex-row align-items-center mb-3">
                <div className="fs-5 text-dark"> Search  </div>

                <Input
                  type="text"
                  placeholder="title"
                  className="inputSearch me-4"
                  onSearch={(value) => {
                    setSearchedText(value);
                  }}
                  onChange={(e) => setSearchedText(e.target.value)}
                />
                
              </div>
             
              <Table
                dataSource={list}
                columns={column}
                onChange={onChange}
                pagination={{ pageSize: 10 }}
              />
              <Button onClick={() => clearList()} variant="primary">
                Clear List
              </Button>
              <Modal
                title="Update list"
                open={isEditing}
                okText="Save Changes"
                  
                onCancel={() => resetEditing()}
                onOk={() => {
                  setList((pre) => {
                    return pre.map((item) => {
                      if (item.id === editingItem.id) {
                        return editingItem;
                      } else {
                        return item;
                      }
                    });
                  });
                  resetEditing();
                }}
              >
                <Input
                  value={editingItem?.title}
                  onChange={(e) =>
                    setEditingItem((pre) => {
                      return { ...pre, title: e.target.value };
                    })
                  }
                />
                <Input
                  value={editingItem?.desc}
                  onChange={(e) =>
                    setEditingItem((pre) => {
                      return { ...pre, desc: e.target.value };
                    })
                  }
                />
                <Input
                  value={editingItem?.dueDate}
                  onChange={(e) =>
                    setEditingItem((pre) => {
                      return { ...pre, dueDate: e.target.value };
                    })
                  }
                />
                <Input
                  value={editingItem?.tags}
                  onChange={(e) =>
                    setEditingItem((pre) => {
                      return { ...pre, tags: e.target.value };
                    })
                  }
                />
                <Input
                  value={editingItem?.status}
                  onChange={(e) =>
                    setEditingItem((pre) => {
                      return { ...pre, status: e.target.value };
                    })
                  }
                />
              </Modal>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
