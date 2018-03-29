from neo4j.v1 import GraphDatabase

uri = "bolt://localhost:7687"
driver = GraphDatabase.driver(uri, auth=("neo4j", "password"))

def add_activity_to_graph(Name):

    if not check_if_exists('Activity',Name):
        with driver.session() as session:
            with session.begin_transaction() as tx:
                result = tx.run("CREATE(a:Activity {name:{Name}}) RETURN a.name", Name= Name)
                print ([record["a.name"] for record in result])
    else:
        print("This tag already exists")



def add_tag_to_graph(Name):
    if not check_if_exists('Tag',Name):
        with driver.session() as session:
            with session.begin_transaction() as tx:
                tx.run("CREATE(a:Tag {name:{Name}}) RETURN a", Name= Name)


def add_relationship_to_graph(Name,Tag,Weight):
    with driver.session() as session:
        with session.begin_transaction() as tx:
            tx.run("MATCH (a:Activity { name: '%s' }),(b:Tag{ name: '%s' }) MERGE (a)-[r:tag{weight:%s}]->(b) RETURN a" % (Name, Tag, Weight))




def check_if_exists(Node, Name):
    with driver.session() as session:
        with session.begin_transaction() as tx:
            result = tx.run("MATCH(a:%s {name:'%s'}) Return a.name" % (Node, Name))
            values = ([record["a.name"] for record in result])
            return values
            
