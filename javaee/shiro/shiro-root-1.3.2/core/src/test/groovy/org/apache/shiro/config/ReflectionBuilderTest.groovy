/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package org.apache.shiro.config

import org.apache.shiro.codec.Base64
import org.apache.shiro.codec.CodecSupport
import org.apache.shiro.codec.Hex
import org.apache.shiro.config.event.BeanEvent
import org.apache.shiro.realm.ldap.JndiLdapRealm
import org.apache.shiro.util.CollectionUtils
import org.junit.Test

import static org.junit.Assert.*

/**
 * Unit tests for the {@link ReflectionBuilder} implementation.
 */
@SuppressWarnings("GrMethodMayBeStatic")
class ReflectionBuilderTest {

    @Test
    void testStandardPropertyAssignment() {
        ReflectionBuilder builder = new ReflectionBuilder();

        CompositeBean cBean = new CompositeBean();
        builder.applyProperty(cBean, 'stringProp', 'hello world')
        builder.applyProperty(cBean, 'booleanProp', true)
        builder.applyProperty(cBean, 'intProp', 42)
        builder.applyProperty(cBean, 'simpleBean', new SimpleBean())
        
        assertTrue cBean.stringProp == 'hello world'
        assertTrue cBean.booleanProp
        assertTrue cBean.intProp == 42
        assertTrue cBean.simpleBean instanceof SimpleBean
    }

    @Test
    void testMapEntryAssignment() {
        ReflectionBuilder builder = new ReflectionBuilder();

        CompositeBean cBean = new CompositeBean();
        cBean.simpleBeanMap = ['simpleBean1': new SimpleBean()]
        
        builder.applyProperty(cBean, 'simpleBeanMap[simpleBean2]', new SimpleBean())
        
        assertTrue cBean.simpleBeanMap['simpleBean2'] instanceof SimpleBean
    }

    @Test
    void testArrayEntryAssignment() {
        ReflectionBuilder builder = new ReflectionBuilder();

        CompositeBean cBean = new CompositeBean();
        cBean.compositeBeanArray = new CompositeBean[1];

        builder.applyProperty(cBean, 'compositeBeanArray[0]', new CompositeBean())

        assertTrue cBean.compositeBeanArray[0] instanceof CompositeBean
    }

    @Test
    void testNestedPathAssignment() {
        ReflectionBuilder builder = new ReflectionBuilder();

        CompositeBean cbean1 = new CompositeBean('cbean1');
        cbean1.compositeBeanMap = ['cbean2': new CompositeBean('cbean2')]
        cbean1.compositeBeanMap['cbean2'].compositeBeanArray = new CompositeBean[2];
        
        builder.applyProperty(cbean1, "compositeBeanMap[cbean2].compositeBeanArray[0]", new CompositeBean('cbean3'))
        builder.applyProperty(cbean1, "compositeBeanMap[cbean2].compositeBeanArray[0].simpleBean", new SimpleBean('sbean1'))

        assertTrue cbean1.compositeBeanMap['cbean2'].compositeBeanArray[0].name == 'cbean3'
        assertTrue cbean1.compositeBeanMap['cbean2'].compositeBeanArray[0].simpleBean.name == 'sbean1'
    }

    //asserts SHIRO-305: https://issues.apache.org/jira/browse/SHIRO-305
    @Test
    void testNestedMapAssignmentWithPeriodDelimitedKeys() {
        def ini = new Ini()
        ini.load('''
            ldapRealm = org.apache.shiro.realm.ldap.JndiLdapRealm
            ldapRealm.contextFactory.environment[java.naming.security.protocol] = ssl
            ldapRealm.contextFactory.environment[com.sun.jndi.ldap.connect.pool] = true 
            ldapRealm.contextFactory.environment[com.sun.jndi.ldap.connect.pool.protocol] = plain ssl 
        ''')
        def builder = new ReflectionBuilder()
        def objects = builder.buildObjects(ini.getSections().iterator().next())
        
        assertFalse objects.isEmpty()
        def ldapRealm = objects['ldapRealm'] as JndiLdapRealm
        assertEquals 'ssl', ldapRealm.contextFactory.environment['java.naming.security.protocol']
        assertEquals 'true', ldapRealm.contextFactory.environment['com.sun.jndi.ldap.connect.pool']
        assertEquals 'plain ssl', ldapRealm.contextFactory.environment['com.sun.jndi.ldap.connect.pool.protocol']
    }

    @Test
    void testSimpleConfig() {
        Map<String, String> defs = new LinkedHashMap<String, String>();
        defs.put("compositeBean", "org.apache.shiro.config.CompositeBean");
        defs.put("compositeBean.stringProp", "blah");
        defs.put("compositeBean.booleanProp", "true");
        defs.put("compositeBean.intProp", "42");

        ReflectionBuilder builder = new ReflectionBuilder();
        Map beans = builder.buildObjects(defs);

        CompositeBean compositeBean = (CompositeBean) beans.get("compositeBean");
        assertNotNull(compositeBean);
        assertEquals(compositeBean.getStringProp(), "blah");
        assertTrue(compositeBean.isBooleanProp());
        assertEquals(compositeBean.getIntProp(), 42);
    }

    @Test
    void testWithConfiguredNullValue() {
        Map<String,Object> defaults = new LinkedHashMap<String,Object>();
        CompositeBean cBean = new CompositeBean();
        cBean.setSimpleBean(new SimpleBean());
        defaults.put("compositeBean", cBean);

        Map<String, String> defs = new LinkedHashMap<String, String>();
        defs.put("compositeBean.intProp", "42");
        defs.put("compositeBean.booleanProp", "true");
        defs.put("compositeBean.stringProp", "test");
        defs.put("compositeBean.simpleBean", "null");

        ReflectionBuilder builder = new ReflectionBuilder(defaults);
        Map beans = builder.buildObjects(defs);

        CompositeBean compositeBean = (CompositeBean) beans.get("compositeBean");
        assertNotNull(compositeBean);
        assertTrue(compositeBean.isBooleanProp());
        assertEquals(compositeBean.getIntProp(), 42);
        assertEquals("test", compositeBean.getStringProp());
        assertNull(compositeBean.getSimpleBean());
    }

    @Test
    void testWithConfiguredNullLiteralValue() {
        Map<String, String> defs = new LinkedHashMap<String, String>();
        defs.put("compositeBean", "org.apache.shiro.config.CompositeBean");
        defs.put("compositeBean.intProp", "42");
        defs.put("compositeBean.booleanProp", "true");
        defs.put("compositeBean.stringProp", "\"null\"");

        ReflectionBuilder builder = new ReflectionBuilder();
        Map beans = builder.buildObjects(defs);

        CompositeBean compositeBean = (CompositeBean) beans.get("compositeBean");
        assertNotNull(compositeBean);
        assertTrue(compositeBean.isBooleanProp());
        assertEquals(compositeBean.getIntProp(), 42);
        assertEquals("null", compositeBean.getStringProp());
    }

    @Test
    void testWithConfiguredEmptyStringValue() {
        Map<String, String> defs = new LinkedHashMap<String, String>();
        defs.put("compositeBean", "org.apache.shiro.config.CompositeBean");
        defs.put("compositeBean.intProp", "42");
        defs.put("compositeBean.booleanProp", "true");
        defs.put("compositeBean.stringProp", "\"\"");

        ReflectionBuilder builder = new ReflectionBuilder();
        Map beans = builder.buildObjects(defs);

        CompositeBean compositeBean = (CompositeBean) beans.get("compositeBean");
        assertNotNull(compositeBean);
        assertTrue(compositeBean.isBooleanProp());
        assertEquals(compositeBean.getIntProp(), 42);
        assertEquals("", compositeBean.getStringProp());
    }

    @Test
    void testWithConfiguredEmptyStringLiteralValue() {
        Map<String, String> defs = new LinkedHashMap<String, String>();
        defs.put("compositeBean", "org.apache.shiro.config.CompositeBean");
        defs.put("compositeBean.intProp", "42");
        defs.put("compositeBean.booleanProp", "true");
        defs.put("compositeBean.stringProp", "\"\"\"\"");

        ReflectionBuilder builder = new ReflectionBuilder();
        Map beans = builder.buildObjects(defs);

        CompositeBean compositeBean = (CompositeBean) beans.get("compositeBean");
        assertNotNull(compositeBean);
        assertTrue(compositeBean.isBooleanProp());
        assertEquals(compositeBean.getIntProp(), 42);
        assertEquals("\"\"", compositeBean.getStringProp());
    }

    @Test
    void testSimpleConfigWithDollarSignStringValue() {
        Map<String, String> defs = new LinkedHashMap<String, String>();
        defs.put("compositeBean", "org.apache.shiro.config.CompositeBean");
        defs.put("compositeBean.stringProp", '\\$500');

        ReflectionBuilder builder = new ReflectionBuilder();
        Map beans = builder.buildObjects(defs);

        CompositeBean compositeBean = (CompositeBean) beans.get("compositeBean");
        assertEquals(compositeBean.getStringProp(), '$500');
    }

    @Test
    void testObjectReferenceConfig() {
        Map<String, String> defs = new LinkedHashMap<String, String>();
        defs.put("simpleBean", "org.apache.shiro.config.SimpleBean");
        defs.put("simpleBean.intProp", "101");
        defs.put("compositeBean", "org.apache.shiro.config.CompositeBean");
        defs.put("compositeBean.stringProp", "blah");
        defs.put("compositeBean.simpleBean", '$simpleBean');

        ReflectionBuilder builder = new ReflectionBuilder();
        Map beans = builder.buildObjects(defs);

        CompositeBean compositeBean = (CompositeBean) beans.get("compositeBean");
        assertNotNull(compositeBean);
        assertEquals(compositeBean.getStringProp(), "blah");
        SimpleBean simpleBean = (SimpleBean) beans.get("simpleBean");
        assertNotNull(simpleBean);
        assertNotNull(compositeBean.getSimpleBean());
        assertEquals(simpleBean, compositeBean.getSimpleBean());
        assertEquals(simpleBean.getIntProp(), 101);
    }

    @Test(expected=ConfigurationException)
    void testObjectReferenceConfigWithTypeMismatch() {
        Map<String, String> defs = new LinkedHashMap<String, String>();
        defs.put("simpleBean", "org.apache.shiro.config.SimpleBean");
        defs.put("compositeBean", "org.apache.shiro.config.CompositeBean");
        defs.put("compositeBean.simpleBean", "simpleBean");
        ReflectionBuilder builder = new ReflectionBuilder();
        builder.buildObjects(defs);
    }

    @Test(expected=UnresolveableReferenceException)
    void testObjectReferenceConfigWithInvalidReference() {
        Map<String, String> defs = new LinkedHashMap<String, String>();
        defs.put("simpleBean", "org.apache.shiro.config.SimpleBean");
        defs.put("compositeBean", "org.apache.shiro.config.CompositeBean");
        defs.put("compositeBean.simpleBean", '$foo');
        ReflectionBuilder builder = new ReflectionBuilder();
        builder.buildObjects(defs);
    }

    @Test
    void testSetProperty() {
        Map<String, String> defs = new LinkedHashMap<String, String>();
        defs.put("simpleBean1", "org.apache.shiro.config.SimpleBean");
        defs.put("simpleBean2", "org.apache.shiro.config.SimpleBean");
        defs.put("compositeBean", "org.apache.shiro.config.CompositeBean");
        defs.put("compositeBean.simpleBeanSet", '$simpleBean1, $simpleBean2, $simpleBean2');
        ReflectionBuilder builder = new ReflectionBuilder();
        Map objects = builder.buildObjects(defs);
        assertFalse(CollectionUtils.isEmpty(objects));
        CompositeBean cBean = (CompositeBean) objects.get("compositeBean");
        assertNotNull(cBean);
        Set<SimpleBean> simpleBeans = cBean.getSimpleBeanSet();
        assertNotNull(simpleBeans);
        assertEquals(2, simpleBeans.size());
    }

    @Test
    void testListProperty() {
        Map<String, String> defs = new LinkedHashMap<String, String>();
        defs.put("simpleBean1", "org.apache.shiro.config.SimpleBean");
        defs.put("simpleBean2", "org.apache.shiro.config.SimpleBean");
        defs.put("compositeBean", "org.apache.shiro.config.CompositeBean");
        defs.put("compositeBean.simpleBeanList", '$simpleBean1, $simpleBean2, $simpleBean2');
        ReflectionBuilder builder = new ReflectionBuilder();
        Map objects = builder.buildObjects(defs);
        assertFalse(CollectionUtils.isEmpty(objects));
        CompositeBean cBean = (CompositeBean) objects.get("compositeBean");
        assertNotNull(cBean);
        List<SimpleBean> simpleBeans = cBean.getSimpleBeanList();
        assertNotNull(simpleBeans);
        assertEquals(3, simpleBeans.size());
    }

    @Test
    void testCollectionProperty() {
        Map<String, String> defs = new LinkedHashMap<String, String>();
        defs.put("simpleBean1", "org.apache.shiro.config.SimpleBean");
        defs.put("simpleBean2", "org.apache.shiro.config.SimpleBean");
        defs.put("compositeBean", "org.apache.shiro.config.CompositeBean");
        defs.put("compositeBean.simpleBeanCollection", '$simpleBean1, $simpleBean2, $simpleBean2');
        ReflectionBuilder builder = new ReflectionBuilder();
        Map objects = builder.buildObjects(defs);
        assertFalse(CollectionUtils.isEmpty(objects));
        CompositeBean cBean = (CompositeBean) objects.get("compositeBean");
        assertNotNull(cBean);
        Collection<SimpleBean> simpleBeans = cBean.getSimpleBeanCollection();
        assertNotNull(simpleBeans);
        assertTrue(simpleBeans instanceof List);
        assertEquals(3, simpleBeans.size());
    }

    @Test
    void testByteArrayHexProperty() {
        String source = "Hello, world.";
        byte[] bytes = CodecSupport.toBytes(source);
        String hex = Hex.encodeToString(bytes);
        String hexValue = "0x" + hex;

        Map<String, String> defs = new LinkedHashMap<String, String>();
        defs.put("simpleBean", "org.apache.shiro.config.SimpleBean");
        defs.put("simpleBean.byteArrayProp", hexValue);
        ReflectionBuilder builder = new ReflectionBuilder();
        Map objects = builder.buildObjects(defs);
        assertFalse(CollectionUtils.isEmpty(objects));
        SimpleBean bean = (SimpleBean) objects.get("simpleBean");
        assertNotNull(bean);
        byte[] beanBytes = bean.getByteArrayProp();
        assertNotNull(beanBytes);
        String reconstituted = CodecSupport.toString(beanBytes);
        assertEquals(source, reconstituted);
    }

    @Test
    void testByteArrayBase64Property() {
        String source = "Hello, world.";
        byte[] bytes = CodecSupport.toBytes(source);
        String base64 = Base64.encodeToString(bytes);

        Map<String, String> defs = new LinkedHashMap<String, String>();
        defs.put("simpleBean", "org.apache.shiro.config.SimpleBean");
        defs.put("simpleBean.byteArrayProp", base64);
        ReflectionBuilder builder = new ReflectionBuilder();
        Map objects = builder.buildObjects(defs);
        SimpleBean bean = (SimpleBean) objects.get("simpleBean");
        byte[] beanBytes = bean.getByteArrayProp();
        assertNotNull(beanBytes);
        assertTrue(Arrays.equals(beanBytes, bytes));
        String reconstituted = CodecSupport.toString(beanBytes);
        assertEquals(reconstituted, source);
    }

    @Test
    void testMapProperty() {
        Map<String, String> defs = new LinkedHashMap<String, String>();
        defs.put("simpleBean1", "org.apache.shiro.config.SimpleBean");
        defs.put("simpleBean2", "org.apache.shiro.config.SimpleBean");
        defs.put("compositeBean", "org.apache.shiro.config.CompositeBean");
        defs.put("compositeBean.simpleBeanMap", 'simpleBean1:$simpleBean1, simpleBean2:$simpleBean2');
        ReflectionBuilder builder = new ReflectionBuilder();
        Map objects = builder.buildObjects(defs);
        assertFalse(CollectionUtils.isEmpty(objects));
        CompositeBean cBean = (CompositeBean) objects.get("compositeBean");
        assertNotNull(cBean);
        Map map = cBean.getSimpleBeanMap();
        assertNotNull(map);
        assertEquals(2, map.size());
        Object value = map.get("simpleBean1");
        assertTrue(value instanceof SimpleBean);
        value = map.get("simpleBean2");
        assertTrue(value instanceof SimpleBean);
    }

    @Test
    void testNestedListProperty() {
        Map<String, String> defs = new LinkedHashMap<String, String>();
        defs.put("simpleBean1", "org.apache.shiro.config.SimpleBean");
        defs.put("simpleBean2", "org.apache.shiro.config.SimpleBean");
        defs.put("simpleBean3", "org.apache.shiro.config.SimpleBean");
        defs.put("compositeBean", "org.apache.shiro.config.CompositeBean");
        defs.put("compositeBean.simpleBean", '$simpleBean1');
        defs.put("compositeBean.simpleBean.simpleBeans", '$simpleBean2, $simpleBean3');
        ReflectionBuilder builder = new ReflectionBuilder();
        Map objects = builder.buildObjects(defs);
        assertFalse(CollectionUtils.isEmpty(objects));
        CompositeBean cBean = (CompositeBean) objects.get("compositeBean");
        assertNotNull(cBean);
        SimpleBean nested = cBean.getSimpleBean();
        assertNotNull(nested);
        List<SimpleBean> children = nested.getSimpleBeans();
        assertNotNull(children);
        assertEquals(2, children.size());
    }

    @Test
    void testFactoryInstantiation() {
        Map<String, String> defs = new LinkedHashMap<String, String>();
        defs.put("simpleBeanFactory", "org.apache.shiro.config.SimpleBeanFactory");
        defs.put("simpleBeanFactory.factoryInt", "5");
        defs.put("simpleBeanFactory.factoryString", "someString");
        defs.put("compositeBean", "org.apache.shiro.config.CompositeBean");
        defs.put("compositeBean.simpleBean", '$simpleBeanFactory');

        ReflectionBuilder builder = new ReflectionBuilder();
        Map objects = builder.buildObjects(defs);
        assertFalse(CollectionUtils.isEmpty(objects));
        CompositeBean compositeBean = (CompositeBean) objects.get("compositeBean");
        SimpleBean bean = compositeBean.getSimpleBean();
        assertNotNull(bean);
        assertEquals(5, bean.getIntProp());
        assertEquals("someString", bean.getStringProp());
    }

    @Test
    void testBeanListeners() {

        def ini = new Ini();
        ini.load '''
            loggingListener = org.apache.shiro.config.event.LoggingBeanEventListener
            listenerOne = org.apache.shiro.config.RecordingBeanListener
            listenerTwo = org.apache.shiro.config.RecordingBeanListener

            simpleBeanFactory = org.apache.shiro.config.SimpleBeanFactory
            simpleBeanFactory.factoryInt = 5
            simpleBeanFactory.factoryString = someString

            compositeBean = org.apache.shiro.config.CompositeBean
            compositeBean.simpleBean = $simpleBeanFactory
        '''

        ReflectionBuilder builder = new ReflectionBuilder();
        Map<String, ?> objects = builder.buildObjects(ini.getSections().iterator().next());
        assertFalse(CollectionUtils.isEmpty(objects));

        assertInstantiatedEvents("listenerOne", objects, 4) //3 beans following + its own instantiated event
        assertConfiguredEvents("listenerOne", objects, 4) //3 beans following + its own configured event
        assertInitializedEvents("listenerOne", objects, 4) //3 beans following + its own initialized event

        assertInstantiatedEvents("listenerTwo", objects, 3) //2 beans following + its own instantiated event
        assertConfiguredEvents("listenerTwo", objects, 3); //2 beans following + its own configured event
        assertInitializedEvents("listenerTwo", objects, 3); //2 beans following + its own initialized event

        builder.destroy();

        assertDestroyedEvents("listenerOne", objects, 4); //3 beans defined after it + its own destroyed event
        assertDestroyedEvents("listenerTwo", objects, 3); //2 beans defined after it + its own destroyed event
    }

    void assertInstantiatedEvents(String name, Map<String, ?> objects, int expected) {
        def bean = objects.get(name) as RecordingBeanListener
        def events = bean.getInstantiatedEvents()
        assertEquals(expected, events.size())

        checkType(name, events, "simpleBeanFactory", SimpleBeanFactory);
        checkType(name, events, "compositeBean", CompositeBean);
    }

    void assertConfiguredEvents(String name, Map<String, ?> objects, int expected) {
        def bean = objects.get(name) as RecordingBeanListener
        def events = bean.getConfiguredEvents();
        assertEquals(expected, events.size())

        checkType(name, events, "listenerTwo", RecordingBeanListener);
        checkType(name, events, "simpleBeanFactory", SimpleBeanFactory);
        checkType(name, events, "compositeBean", CompositeBean);
    }

    void assertInitializedEvents(String name, Map<String, ?> objects, int expected) {
        def bean = objects.get(name) as RecordingBeanListener
        def events = bean.getInitializedEvents();
        assertEquals(expected, events.size())

        checkType(name, events, "listenerTwo", RecordingBeanListener);
        checkType(name, events, "simpleBeanFactory", SimpleBeanFactory);
        checkType(name, events, "compositeBean", CompositeBean);
    }

    void assertDestroyedEvents(String name, Map<String, ?> objects, int expected) {
        def bean = objects.get(name) as RecordingBeanListener
        def events = bean.getDestroyedEvents();
        assertEquals(expected, events.size())

        if (expected > 3) {
            checkType(name, events, "listenerOne", RecordingBeanListener);
        }
        checkType(name, events, "listenerTwo", RecordingBeanListener);
        checkType(name, events, "simpleBeanFactory", SimpleBeanFactory);
        checkType(name, events, "compositeBean", CompositeBean);
    }

    void checkType(String instanceName, List<? extends BeanEvent> events, String name, Class<?> expectedType) {
        for(BeanEvent event: events) {
            if(event.getBeanName().equals(name)) {
                assertTrue("Notification for bean " + name + " did not provide an instance of " + expectedType
                        + " to listener " + instanceName,
                expectedType.isInstance(event.getBean()))
                return;
            }
        }
        fail("No bean named " + name + " was ever notified to listener " + instanceName + ".");
    }
}
