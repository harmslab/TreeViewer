var Data = function() { 
        this.data = {"name": "Level 1",
                     "children": [
                      {
                       "name": "Level 2",
                       "children": [
                        {
                         "name": "Level 3,a",
                         "children": [
                          {"name": "Level 4,a", "size": 3938},
                          {"name": "Level 4,b", "size": 3812},
                          {"name": "Level 4,c", "size": 743}
                         ]
                        },
                        {
                         "name": "Level 3,b",
                         "children": [
                          {"name": "Level 4,d", "size": 3534},
                          {"name": "Level 4,e", "size": 5731}
                         ]
                        }
                       ]
                      }
                     ]
                    };
            
        this.data2 = {"name": "Level 1",
                     "children": [
                      {
                       "name": "Level 2",
                       "children": [
                        {
                         "name": "Level 3,a"
                        },
                        {
                         "name": "Level 3,b",
                         "children": [
                          {
                           "name": "Level 4,d", "size": 3534,
                           "children": [
                            {"name": "Level 4,a", "size": 3938},
                            {"name": "Level 4,b", "size": 3812},
                            {"name": "Level 4,c", "size": 743}
                           ]
                          },
                          {"name": "Level 4,e", "size": 5731}
                         ]
                        }
                       ]
                      }
                     ]
                    };
            

        this.data3 = {"name": "Level 1",
                     "children": [
                      {
                       "name": "Level 2",
                       "children": [
                        {
                         "name": "Level 3,a"
                        },
                        {
                         "name": "Level 3,b",
                         "children": [
                          {"name": "Level 4,d", "size": 3534},
                          {"name": "Level 4,e", "size": 5731,
                           "children": [
                            {"name": "Level 4,a", "size": 3938},
                            {"name": "Level 4,b", "size": 3812},
                            {"name": "Level 4,c", "size": 743}
                           ]
                           }
                         ]
                        }
                       ]
                      }
                     ]
                    };
            
};